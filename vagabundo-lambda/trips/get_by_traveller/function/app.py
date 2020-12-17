"""
TODO
"""
import logging
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from libs.db import Trip, TripPosition, Traveller
from libs.time import evaluate_time_range_default_to_current_year
from libs.travellers.functions import try_to_find_traveller
from libs.trips import TripResponse as Response
from libs.trips import from_trip_entity_to_trip_response

LOGGER = logging.getLogger("Trips/GetByTraveller")


def lambda_handler(event, context):
    engine = create_engine(os.environ["DB_HOST"])
    session = sessionmaker(bind=engine)()
    from_date, to_date = evaluate_time_range_default_to_current_year(event)

    traveller_or_not_found_response = try_to_find_traveller(event, session)
    if type(traveller_or_not_found_response) is not Traveller:
        return traveller_or_not_found_response

    traveller = traveller_or_not_found_response

    trips = session.query(Trip) \
        .filter(Trip.origin.has(TripPosition.time_point >= from_date)) \
        .filter(Trip.destination.has(TripPosition.time_point <= to_date)) \
        .filter(Trip.traveller_id == traveller.id).all()

    res = [from_trip_entity_to_trip_response(trip) for trip in trips]
    LOGGER.info("{} Trips of traveller {} found from {} to {}".format(len(trips), traveller, from_date, to_date))
    session.close()
    return {
        "statusCode": 200,
        "body": Response.schema().dumps(res, many=True)
    }
