'use strict';

const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const proxyquire = require('proxyquire');

const stub = sinon.stub().returns({
    query: (sqlQuery, params) => {
      return Promise.resolve([{
        first_name: 'Max',
        last_name: 'Mustermann',
        bk: 'mmustermann',
        current_team: 'CST'
      }]);
    },
    end: () => {}
  });
const app = proxyquire('../../app.js', { 'serverless-mysql': stub });

describe('TravellerGet', function () {
  it('returns a traveller as expected', async () => {
    const event = {
      pathParameters: {
        travellerName: 'mmustermann'
      }
    }
    var context;
    const result = await app.lambdaHandler(event, context);

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.equal('{"firstName":"Max","lastName":"Mustermann","bk":"mmustermann","team":"CST"}');
  });

  it('returns a 400 error if no traveller name (business key) is given', async () => {
    const event = {};
    const result = await app.lambdaHandler(event, null);

    expect(result).to.be.an('object');
    expect(result).to.have.property('statusCode').and.to.equal(400);
    expect(result).to.have.property('body').to.have.lengthOf.at.least(10); // the error message should have a reasonable length, i.e. contain a meaningful message
  });
});
