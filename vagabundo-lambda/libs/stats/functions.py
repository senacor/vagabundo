from datetime import datetime
from decimal import Decimal

from libs import Value
from libs.db import TransportType
from libs.stats.response import TransportStat, Emission, TotalStat, StatsResponse as Response


def create_transport_stat_response(stats, monetary_co2e_factor, team_size):
    taxi, plane, train = None, None, None
    for stat in stats:
        if stat.transport == TransportType.TAXI:
            taxi = from_stat_row_to_transport_stat(stat, team_size, monetary_co2e_factor)
        elif stat.transport == TransportType.PLANE:
            plane = from_stat_row_to_transport_stat(stat, team_size, monetary_co2e_factor)
        elif stat.transport == TransportType.TRAIN:
            train = from_stat_row_to_transport_stat(stat, team_size, monetary_co2e_factor)
    return taxi, plane, train


def create_stats_response(stats, monetary_co2e_factor, to_date, from_date, team_size, company_size, company_co2e_sum) \
        -> Response:
    taxi, plane, train = create_transport_stat_response(stats, monetary_co2e_factor, team_size)

    company_co2e_per_capita = \
        calculate_co2e_per_capita_averaged_over_time(to_date, from_date, company_size, company_co2e_sum)

    time_range_in_months = Decimal(to_date.year - from_date.year) * 12 + Decimal(to_date.month - from_date.month) + 1
    average_team_size = 1 if team_size == 1 else (team_size / time_range_in_months)

    total = calculate_total([taxi, plane, train], company_co2e_per_capita, average_team_size, monetary_co2e_factor)
    return Response(train, taxi, plane, total)


def from_stat_row_to_transport_stat(row, size, co2e_factor) -> TransportStat:
    emission = Emission(row.emission, row.compensated_emission)
    emission_per_capita = emission if size == 1 else calculate_co2e_per_capita(size, row.emission)
    stat = TransportStat(emission=emission, emissionPerCapita=emission_per_capita, distance=row.distance,
                         monetaryCo2e=row.emission * co2e_factor)
    return stat


def calculate_co2e_per_capita(size, total_emission) -> Emission:
    return Emission(total_emission / size, Decimal(0))


def calculate_co2e_per_capita_averaged_over_time(to_date: datetime, from_date: datetime,
                                                 company_size, total_emission: Decimal):
    time_range_in_months = (to_date.year - from_date.year) * 12 + (to_date.month - from_date.month) + 1
    return total_emission / Decimal(company_size / time_range_in_months)


def calculate_total(stats: [TransportStat], company_co2e_per_capita: Decimal, average_team_size: Decimal, co2e_factor) \
        -> TotalStat:
    stats = [stat for stat in stats if stat is not None]
    total_co2e = sum([stat.emission.co2e for stat in stats])
    total_co2e_compensated = sum([stat.emission.compensatedCo2e for stat in stats])
    total_emission = Emission(total_co2e, total_co2e_compensated)
    total_distance = sum([stat.distance for stat in stats])
    total_monetary_co2e = total_co2e * co2e_factor
    per_capita_emission = Emission(total_co2e / average_team_size,
                                   total_co2e_compensated / average_team_size)

    ratio = Value((total_co2e / company_co2e_per_capita) - 1)
    return TotalStat(emission=total_emission, emissionPerCapita=per_capita_emission, distance=total_distance,
                     monetaryCo2e=total_monetary_co2e, ratio=ratio)
