"""
Returns a certain Trip, identified by a given id
"""
import logging
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from libs.db import Trip
from libs.trips import from_trip_entity_to_trip_response

LOGGER = logging.getLogger("Trips/GetById")


def lambda_handler(event, context):
    engine = create_engine(os.environ['DB_HOST'])
    session = sessionmaker(bind=engine)()

    trip_id = event["pathParameters"]["id"]
    LOGGER.info("Getting Trip {}".format(trip_id))
    trip = session.query(Trip).get(trip_id)
    if trip is None:
        return {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": 'Trip {} not found'.format(trip_id)
        }

    res = from_trip_entity_to_trip_response(trip)
    session.close()
    return {
        "statusCode": 200,
        "body": res.to_json()
    }
