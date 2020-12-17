"""
TODO
"""
import logging
import os
from decimal import Decimal

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from libs.stats import company_co2e, company_total_team_size, team_emission_grouped_by_transport_type, \
    total_certain_team_size, create_stats_response
from libs.time import evaluate_time_range_default_to_current_year

LOGGER = logging.getLogger("Stats/GetByTeam")


def lambda_handler(event, context):
    engine = create_engine(os.environ["DB_HOST"])
    session = sessionmaker(bind=engine)()
    monetary_co2e_factor = Decimal(os.environ["MONETARY_CO2E_FACTOR"])

    try:
        team_name = event["pathParameters"]["teamName"]
    except KeyError:
        return {
            "statusCode": 400,
            "body": "No Team-Name name given"
        }

    from_date, to_date = evaluate_time_range_default_to_current_year(event)
    LOGGER.info("Get team stats for {} for the time period {} to {}"
                .format(team_name, from_date, to_date))

    team_stats = team_emission_grouped_by_transport_type(session, team_name, from_date, to_date)
    team_size = total_certain_team_size(session, team_name, from_date, to_date)
    company_co2e_sum = company_co2e(session, from_date, to_date)
    company_size = company_total_team_size(session, from_date, to_date)

    LOGGER.info("Emission for the time period {} to {} totals to {}".format(from_date, to_date, company_co2e_sum))
    LOGGER.info("Company-Size for the time period {} to {} totals to {}".format(from_date, to_date, company_size))

    no_data_found_response = {
        "statusCode": 404,
        "body": "No data for the team or the company could be found in the given time-range"
    }

    if team_size is None or company_co2e_sum is None or company_size is None:
        return no_data_found_response

    res = create_stats_response(team_stats, monetary_co2e_factor, to_date, from_date, team_size, company_size,
                                company_co2e_sum)
    session.close()
    return {
        "statusCode": 200,
        "body": res.to_json()
    }
