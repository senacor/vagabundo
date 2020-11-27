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

function getLocation(data, prefix, type) {
    switch (type) {
        case 'TAXI':
            return data[prefix + 'street'];
        default:
            return data[prefix + 'station'];
    }
}

function mapTrip(rawData) {
    return {
        id: rawData.id,
        travellerId: rawData.traveller_id,
        startLocation: getLocation(rawData, "from_", rawData.transport),
        endLocation: getLocation(rawData, "to_", rawData.transport),
        startTime: rawData.from_time,
        endTime: rawData.to_time,
        team: rawData.team,
        emission: rawData.co2e,
        transport: rawData.transport,
        distance: rawData.distance
    }
}

function getFromDate(parameters) {
    if (!!parameters && !!parameters.fromDate) return parameters.fromDate;
    return new Date(new Date().getFullYear(), 0, 1).toISOString();
}

function getToDate(parameters) {
    let result = new Date(new Date().getFullYear(), 11, 31)
    if (!!parameters && !!parameters.toDate) {
        result = new Date(parameters.toDate)
        result.setHours(23, 59, 59);
    }
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

/**
 * Gets the traveller ID.
 * @param {String} travellerName business key
 */
async function getTravellerId(travellerName) {
    return 
    const rows = await connection.query('SELECT id FROM traveller WHERE bk = ?', [travellerName]);
    const user = rows[0];
    return !!user ? user.id : undefined;
}

exports.lambdaHandler = async (event, context) => {
    try {
        const travellerName = event.pathParameters.travellerName;

        if (!travellerName) {
            return response(400, 'No traveller given.');
        }
        const travellerId = await getTravellerId(travellerName);
        if (!travellerId) {
            return response(404, 'Traveller not found');
        }
        const fromDate = getFromDate(event.queryStringParameters);
        const toDate = getToDate(event.queryStringParameters);

        const trips = await connection.query('SELECT origin.street_and_number AS from_street, origin.city AS from_city, ' +
          'origin.postal_code AS from_postal_code, origin.country AS from_country, origin.latitude AS from_latitude, ' +
          'origin.longitude AS from_longitude, origin.time_point AS from_time, origin.station AS from_station, ' +
          'origin.station_code AS from_station_code, trip.* ' +
          'FROM trip ' +
          'LEFT JOIN trip_position origin ON trip.origin_id = origin.id ' +
          'LEFT JOIN trip_position destination ON trip.destination_id = destination.id ' +
          'WHERE origin.time_point >= ? AND destination.time_point <= ? AND trip.traveller_id = ?', [fromDate, toDate, travellerId]);
        await connection.end();

        return response(200, trips.map(t => mapTrip(t)));
    } catch (err) {
        console.log(err);
        return err;
    }
};
