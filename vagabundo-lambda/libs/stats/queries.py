from sqlalchemy.sql import func

from libs.db import Trip, TripPosition, Traveller, TeamSize


def company_co2e(session, from_date, to_date):
    return session.query(func.sum(Trip.co2e).label("emission"))\
        .filter(Trip.origin.has(TripPosition.time_point >= from_date))\
        .filter(Trip.destination.has(TripPosition.time_point <= to_date))\
        .first().emission


def company_total_team_size(session, from_date, to_date):
    return session.query(func.sum(TeamSize.team_size).label("size")) \
        .filter(TeamSize.datum >= from_date.date().replace(day=1)) \
        .filter(TeamSize.datum <= to_date.date().replace(day=1)) \
        .first().size


def emission_grouped_by_transport_type_base_query(session, from_date, to_date):
    return session.query(func.sum(Trip.co2e).label("emission"),
                         func.sum(Trip.compensated_co2e).label("compensated_emission"),
                         func.sum(Trip.distance).label("distance"),
                         Trip.transport)\
        .filter(Trip.origin.has(TripPosition.time_point >= from_date))\
        .filter(Trip.destination.has(TripPosition.time_point <= to_date))\
        .group_by(Trip.transport)


def traveller_emission_grouped_by_transport_type(session, traveller, from_date, to_date):
    return emission_grouped_by_transport_type_base_query(session, from_date, to_date)\
        .filter(Trip.traveller.has(Traveller.id == traveller.id))\
        .all()


def team_emission_grouped_by_transport_type(session, team, from_date, to_date):
    return emission_grouped_by_transport_type_base_query(session, from_date, to_date)\
           .filter(Trip.team == team)\
           .all()


def total_certain_team_size(session, team, from_date, to_date):
    return session.query(func.sum(TeamSize.team_size).label("sum_team_size")) \
        .filter(TeamSize.team == team) \
        .filter(TeamSize.datum >= from_date.date().replace(day=1)) \
        .filter(TeamSize.datum <= to_date.date().replace(day=1)) \
        .first().sum_team_size
