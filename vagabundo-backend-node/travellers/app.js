const connection = require('serverless-mysql')({
    config: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'vagabundo',
        port: 3306,
        ssl: 'Amazon RDS'
    }
});

/**
 * Returns a HTTP response object with an appropriate header to enable CORS
 * for local development. Also a convenience function to return the result.
 * @param {Number} statuscode HTTP statuscode
 * @param {String|object} text message or object which will be returned as JSON 
 */
function response(statuscode, body) {
    return {
        statusCode: statuscode,
        headers: { 
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: (typeof body === 'object') ? JSON.stringify(body) : body
    }
}

exports.lambdaHandler = async (event, context) => {
    try {
        const travellerName = (!!event && !!event.pathParameters) ? event.pathParameters.travellerName : null;
        if (!travellerName) {
            return response(400, 'No traveller name given.');
        }
        const rows = await connection.query('SELECT first_name, last_name, bk, current_team FROM traveller WHERE bk = ?', [travellerName]);
        await connection.end()

        const user = rows[0];
        if (!user) {
            return response(404, 'Traveller not found');
        }
        return response(200, {
            firstName: user.first_name,
            lastName: user.last_name,
            bk: user.bk,
            team: user.current_team
        });
    } catch (err) {
        console.log(err);
        return err;
    }
};
