"""
TODO
"""
import logging
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from libs.db import Trip, TripPosition
from libs.time import evaluate_time_range_default_to_current_year
from libs.trips import TripResponse as Response
from libs.trips import from_trip_entity_to_trip_response

LOGGER = logging.getLogger("Trips/Get")


def lambda_handler(event, context):
    engine = create_engine(os.environ['DB_HOST'])
    session = sessionmaker(bind=engine)()
    from_date, to_date = evaluate_time_range_default_to_current_year(event)

    trips = session.query(Trip) \
        .filter(Trip.origin.has(TripPosition.time_point >= from_date)) \
        .filter(Trip.destination.has(TripPosition.time_point <= to_date)).all()

    res = [from_trip_entity_to_trip_response(trip) for trip in trips]
    LOGGER.info("{} Trips found from {} to {}".format(len(trips), from_date, to_date))
    session.close()
    return {
        "statusCode": 200,
        "body": Response.schema().dumps(res, many=True)
    }
