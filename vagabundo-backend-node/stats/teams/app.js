const connection = require('serverless-mysql')({
    config: {
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : 'vagabundo',
        port     : 3306,
        ssl      : 'Amazon RDS'
    }
});

function getFromDate(parameters) {
    if (!!parameters && !!parameters.fromDate) return new Date(parameters.fromDate);
    return new Date(new Date().getFullYear(), 0, 1);
}

function getToDate(parameters) {
    let result = new Date(new Date().getFullYear(), 11, 31)
    if (!!parameters && !!parameters.toDate) {
        result = new Date(parameters.toDate)
        result.setHours(23, 59, 59);
    }
    return result;
}

function getFirstOfMonth(date) {
    if (!date) return null;
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getTotal(statistics, avgTeamSize, companyCo2ePerCapita) {
    let result = {};
    result = {
        "emission": {
            "co2e": statistics.map(s => s.emission).reduce((a, b) => a + b, 0),
            "compensatedCo2e": statistics.map(s => s.compensated_emission).reduce((a, b) => a + b, 0)
        },
        "distance": statistics.map(s => s.distance).reduce((a, b) => a + b, 0)
    }
    result.monetaryCo2e = result.emission.co2e * process.env.MONETARY_CO2E_FACTOR;
    result.emissionPerCapita = {
        "co2e": result.emission.co2e / avgTeamSize,
        "compensatedCo2e": result.emission.compensatedCo2e / avgTeamSize
    };
    result.ratio = {
        "value": (result.emissionPerCapita.co2e / companyCo2ePerCapita) - 1
    };

    return result;
}

function getStatistics(teamName, rows, avgTeamSize, companyCo2ePerCapita) {
    const statistics = rows.filter(row => row.team === teamName);
    let result = {
        "team": teamName,
        "stats": {}
    };
    statistics.forEach(statistic => {
        result.stats[statistic.transport.toLowerCase()] = {
            "emission": {
                "co2e": statistic.emission,
                "compensatedCo2e": statistic.compensated_emission
            },
            "distance": statistic.distance,
            "monetaryCo2e": process.env.MONETARY_CO2E_FACTOR * statistic.emission,
            "emissionPerCapita": {
                "co2e": (statistic.emission / avgTeamSize),
                "compensatedCo2e": (statistic.compensated_emission / avgTeamSize)
            }
        }
    });
    result.stats.total = getTotal(statistics, avgTeamSize, companyCo2ePerCapita);

    return result;
}

/**
 * Returns a HTTP response object with an appropriate header to enable CORS
 * for local development. Also a convenience function to return the result.
 * @param {Number} statuscode HTTP statuscode
 * @param {String|object} text message or object which will be returned as JSON 
 */
function response(statuscode, body) {
    return {
        statusCode: statuscode,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: (typeof body === 'object') ? JSON.stringify(body) : body
    }
}

exports.lambdaHandler = async (event, context) => {
    try {
        const fromDate = getFromDate(event.queryStringParameters);
        const firstDayOfMonthFromDate = getFirstOfMonth(fromDate);
        const toDate = getToDate(event.queryStringParameters);
        const firstDayOfMonthToDate = getFirstOfMonth(toDate);

        console.log("Get team stats for the time period " + fromDate + " to " + toDate);

        const rows = await connection.query('SELECT SUM(co2e) AS emission, SUM(co2e) AS compensated_emission, ' +
            '  SUM(distance) AS distance, trip.team, trip.transport, ' +
            '  ( ' +
            '    SELECT SUM(team_size) ' +
            '    from team_size ' +
            '    WHERE team_size.datum >= ? AND team_size.datum < ? AND team_size.team = trip.team ' +
            '  ) AS sum_team_size ' +
            '  FROM trip ' +
            '  LEFT JOIN trip_position origin ON trip.origin_id = origin.id ' +
            '  LEFT JOIN trip_position destination ON trip.destination_id = destination.id ' +
            '  WHERE origin.time_point >= ? AND destination.time_point <= ? ' +
            '  GROUP BY trip.team, trip.transport', 
        [firstDayOfMonthFromDate.toISOString(), firstDayOfMonthToDate.toISOString(), fromDate.toISOString(), toDate.toISOString()]);

        const companyCo2eSum = await connection.query('SELECT SUM(co2e) AS emission ' +
            '  FROM trip ' +
            '  LEFT JOIN trip_position origin ON trip.origin_id = origin.id ' +
            '  LEFT JOIN trip_position destination ON trip.destination_id = destination.id ' +
            '  WHERE origin.time_point >= ? AND destination.time_point <= ? ',
            [fromDate.toISOString(), toDate.toISOString()]);

        const companySizeSum = await connection.query('SELECT SUM(team_size) AS size ' +
            '  FROM team_size ' +
            '  WHERE datum >= ? AND datum <= ? ',
            [firstDayOfMonthFromDate.toISOString(), firstDayOfMonthToDate.toISOString()]);

        const teamSizes= await connection.query('SELECT SUM(team_size) AS size, team ' +
            '  FROM team_size ' +
            '  WHERE datum >= ? AND datum <= ? ' +
            '  GROUP BY team ',
            [firstDayOfMonthFromDate.toISOString(), firstDayOfMonthToDate.toISOString()]);

        await connection.end();

        const monthCount = (toDate.getFullYear() - fromDate.getFullYear()) * 12 + (toDate.getMonth() - fromDate.getMonth()) + 1;
        const companyCo2ePerCapita = companyCo2eSum[0].emission / ( companySizeSum[0].size / monthCount )

        const teamToSize = new Map();
        teamSizes.map(t => teamToSize.set(t.team, t.size / monthCount));

        let result = [];
        for (const key of teamToSize.keys()) {
            result.push(getStatistics(key, rows, teamToSize.get(key), companyCo2ePerCapita));
        }

        return response(200, result);
    } catch (err) {
        console.log(err);
        return err;
    }
};
