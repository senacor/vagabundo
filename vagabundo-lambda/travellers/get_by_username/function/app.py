"""
TODO
"""
import logging
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from libs.db import Traveller
from libs.travellers import TravellerResponse as Response
from libs.travellers.functions import try_to_find_traveller

LOGGER = logging.getLogger("Travellers/GetByTraveller")


def lambda_handler(event, context):
    engine = create_engine(os.environ["DB_HOST"])
    session = sessionmaker(bind=engine)()

    traveller_or_not_found_response = try_to_find_traveller(event, session)
    if type(traveller_or_not_found_response) is not Traveller:
        return traveller_or_not_found_response

    traveller = traveller_or_not_found_response

    res = Response(traveller.first_name, traveller.last_name, traveller.bk, traveller.current_team)
    LOGGER.info("Traveller found with bk={}".format(traveller.bk))
    session.close()
    return {
        "statusCode": 200,
        "body": res.to_json()
    }
