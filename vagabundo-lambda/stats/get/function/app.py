"""
TODO
"""
import logging
import os
from decimal import Decimal

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from libs.stats import company_co2e, \
    company_total_team_size, emission_grouped_by_transport_type_base_query, create_stats_response, Value
from libs.time import evaluate_time_range_default_to_current_year

LOGGER = logging.getLogger("Stats/Get")


def lambda_handler(event, context):
    engine = create_engine(os.environ["DB_HOST"])
    session = sessionmaker(bind=engine)()
    monetary_co2e_factor = Decimal(os.environ["MONETARY_CO2E_FACTOR"])
    branch_co2e_per_capaita_per_day = Decimal(os.environ["BRANCH_CO2E_PER_CAPITA_PER_DAY"])

    from_date, to_date = evaluate_time_range_default_to_current_year(event)

    stats = emission_grouped_by_transport_type_base_query(session, from_date, to_date)
    company_co2e_sum = company_co2e(session, from_date, to_date)
    company_size = company_total_team_size(session, from_date, to_date)

    if company_co2e_sum is None or company_size is None:
        return {
            "statusCode": 404
        }

    LOGGER.info(
        "Company-Emission for the time period {} to {} totals to {}".format(from_date, to_date, company_co2e_sum))
    LOGGER.info("Company-Size for the time period {} to {} totals to {}".format(from_date, to_date, company_size))

    res = create_stats_response(stats, monetary_co2e_factor, to_date, from_date, company_size, company_size,
                                company_co2e_sum)

    res.total.ratio = Value(res.total.emissionPerCapita.co2e / (
            (branch_co2e_per_capaita_per_day * (to_date - from_date).days) - 1))
    session.close()
    return {
        "statusCode": 200,
        "body": res.to_json()
    }
