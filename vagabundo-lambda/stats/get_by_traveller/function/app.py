"""
TODO
"""
import logging
import os
from decimal import Decimal

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from libs.db import Traveller
from libs.stats import company_co2e, traveller_emission_grouped_by_transport_type, \
    company_total_team_size, create_stats_response
from libs.time import evaluate_time_range_default_to_current_year
from libs.travellers.functions import try_to_find_traveller

LOGGER = logging.getLogger("Stats/GetByTraveller")


def lambda_handler(event, context):
    engine = create_engine(os.environ["DB_HOST"])
    session = sessionmaker(bind=engine)()
    monetary_co2e_factor = Decimal(os.environ["MONETARY_CO2E_FACTOR"])

    traveller_or_not_found_response = try_to_find_traveller(event, session)
    if type(traveller_or_not_found_response) is not Traveller:
        return traveller_or_not_found_response

    traveller = traveller_or_not_found_response
    from_date, to_date = evaluate_time_range_default_to_current_year(event)
    LOGGER.info("Get traveller stats for {} ({}) for the time period {} to {}"
                .format(traveller.bk, traveller.id, from_date, to_date))

    stats = traveller_emission_grouped_by_transport_type(session, traveller, from_date, to_date)
    company_co2e_sum = company_co2e(session, from_date, to_date)
    company_size = company_total_team_size(session, from_date, to_date)

    LOGGER.info("Emission for the time period {} to {} totals to {}".format(from_date, to_date, company_co2e_sum))
    LOGGER.info("Team-Size for the time period {} to {} totals to {}".format(from_date, to_date, company_size))

    res = create_stats_response(stats, monetary_co2e_factor, to_date, from_date, 1, company_size, company_co2e_sum)
    session.close()
    return {
        "statusCode": 200,
        "body": res.to_json()  # decimal will be encoded as `str`
    }
