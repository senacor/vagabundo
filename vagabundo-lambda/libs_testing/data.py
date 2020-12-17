from datetime import datetime, date

from libs.db import TripPosition, Trip, TransportType, Traveller, TeamSize

harry_potter_one_way_trip_id = 6234
harry_potter_2018_one_way_flight_id = 6345
luke_skywalker_for_id = 1337
luke_skywalker_back_id = 1338
son_goku_one_way_taxi_id = 291
missing_trip_id = 404

TEAM_Z = "Z"
TEAM_LFC = "LFC"
TEAM_FNC = "FNC"


def harry_potter():
    return Traveller(first_name="Harry", last_name="Potter", bk="hpotter", current_team=TEAM_LFC)


def harry_potter_one_way_flight(hp=harry_potter()):
    london_airport = TripPosition(time_point=datetime.fromisoformat('2019-12-01'), station="London (LHR)",
                                  station_code="LHR")
    hamburg_airport = TripPosition(time_point=datetime.fromisoformat('2019-12-04'), station="Hamburg",
                                   station_code="HAM")

    return Trip(id=harry_potter_one_way_trip_id, origin=hamburg_airport, destination=london_airport,
                total_fare=65.00,
                fare_currency="EUR", distance=678.53, operator="Lufthansa",
                team=hp.current_team,
                co2e=200,
                compensated_co2e=0.00, transport=TransportType.PLANE,
                booking_code="2203273339573 2", traveller=hp)


def harry_potter_one_way_train_trip(hp=harry_potter()):
    bonn_hbf_start = TripPosition(time_point=datetime.fromisoformat('2019-11-01T00:00:00'), station="Bonn Hbf")
    fulda_hbf = TripPosition(time_point=datetime.fromisoformat('2019-12-31T23:59:00'), station="Fulda Hbf")

    return Trip(origin=bonn_hbf_start, destination=fulda_hbf,
                total_fare=25,
                fare_currency="EUR", distance=100.25, operator="Lufthansa",
                team=hp.current_team,
                co2e=100,
                compensated_co2e=0.00, transport=TransportType.TRAIN,
                booking_code="ABCDE12", traveller=hp)


def harry_potter_one_way_taxi(hp=harry_potter()):
    hamburg = TripPosition(time_point=datetime.fromisoformat('2019-12-07'), street_number="Sylvesterallee 7",
                           city="Hamburg",
                           postal_code="22525")
    bremen = TripPosition(time_point=datetime.fromisoformat('2019-12-11'), street_number="Franz-Böhmert-Straße 1",
                          city="Bremen ",
                          postal_code="28205")
    return Trip(origin=hamburg, destination=bremen,
                total_fare=169.60, fare_currency="EUR", distance=71.75,
                team=hp.current_team, co2e=50, compensated_co2e=0.00,
                transport=TransportType.TAXI, booking_code="1YT4YB", traveller=hp)


def harry_potter_2018_one_way_flight(hp=harry_potter()):
    london_airport = TripPosition(time_point=datetime.fromisoformat('2018-12-01'), station="London (LHR)",
                                  station_code="LHR")
    hamburg_airport = TripPosition(time_point=datetime.fromisoformat('2018-12-04'), station="Hamburg",
                                   station_code="HAM")

    return Trip(id=harry_potter_2018_one_way_flight_id, origin=hamburg_airport, destination=london_airport,
                total_fare=65.00,
                fare_currency="EUR", distance=678.53, operator="Lufthansa",
                team="DEU",
                co2e=75,
                compensated_co2e=0.00, transport=TransportType.PLANE,
                booking_code="2203163339573 2", traveller=hp)


def luke_skywalker_round_train_trip() -> [Trip, Trip]:
    berlin_hbf_start = TripPosition(time_point=datetime.fromisoformat('2019-01-01T00:00:00'), station="Berlin Bhf")
    nuernberg_hbf = TripPosition(time_point=datetime.fromisoformat('2019-12-31T23:59:00'), station="Nürnberg Bhf")
    berlin_hbf_end = TripPosition(time_point=datetime.fromisoformat('2019-12-03'), station="Berlin Bhf")

    luke_skywalker = Traveller(first_name="Luke", last_name="Skywalker", bk="lskywalker", current_team=TEAM_FNC)
    luke_skywalker_from_berlin_to_nuernberg = Trip(id=luke_skywalker_for_id, origin=berlin_hbf_start,
                                                   destination=nuernberg_hbf,
                                                   total_fare=76.25, fare_currency="EUR", distance=732.07,
                                                   operator="Deutsche Bahn", team=luke_skywalker.current_team,
                                                   co2e=25,
                                                   compensated_co2e=0.00, transport=TransportType.TRAIN,
                                                   booking_code="A1CPYB", traveller=luke_skywalker)
    luke_skywalker_from_nuernberg_to_berlin = Trip(id=luke_skywalker_back_id, origin=nuernberg_hbf,
                                                  destination=berlin_hbf_end,
                                                  total_fare=76.25, fare_currency="EUR", distance=732.07,
                                                  operator="Deutsche Bahn", team=luke_skywalker.current_team,
                                                  co2e=125,
                                                  compensated_co2e=0.00, transport=TransportType.TRAIN,
                                                  booking_code="A2CPYC", traveller=luke_skywalker)
    return luke_skywalker_from_berlin_to_nuernberg, luke_skywalker_from_nuernberg_to_berlin


def han_solo_one_way_plane():
    stuttgart_airport = TripPosition(time_point=datetime.fromisoformat('2019-12-15'), station="Stuttgart (STR)",
                                     station_code="STR")
    leipzig_airport = TripPosition(time_point=datetime.fromisoformat('2019-12-17'), station="Leipzig",
                                   station_code="LEJ")

    han_solo = Traveller(first_name="Han", last_name="Solo", bk="hsolo", current_team=TEAM_FNC)
    return Trip(origin=stuttgart_airport, destination=leipzig_airport, total_fare=128,
                fare_currency="EUR", distance=512, operator="Lufthansa",
                team=han_solo.current_team, co2e=50, compensated_co2e=0.00,
                transport=TransportType.PLANE, booking_code="B1DZD", traveller=han_solo)


def son_goku_one_way_taxi():
    berlin = TripPosition(time_point=datetime.fromisoformat('2019-12-07'), street_number="Willy-Brandt-Straße 1",
                          city="Berlin",
                          postal_code="10557")
    leipzig = TripPosition(time_point=datetime.fromisoformat('2019-12-11'), street_number="Am Sportforum 3",
                           city="Leipzig ",
                           postal_code="04105")
    son_goku = Traveller(first_name="Son", last_name="Goku", bk="sgoku", current_team=TEAM_Z)
    return Trip(id=son_goku_one_way_taxi_id, origin=berlin, destination=leipzig,
                total_fare=169.60, fare_currency="EUR", distance=71.75,
                team=son_goku.current_team, co2e=50, compensated_co2e=0.00,
                transport=TransportType.TAXI, booking_code="1YT4YB", traveller=son_goku)


def team_size_fnc_nov_19():
    return TeamSize(team=TEAM_FNC, team_size=2, datum=date.fromisoformat('2019-11-01'))


def team_size_fnc_dec_19():
    return TeamSize(team=TEAM_FNC, team_size=2, datum=date.fromisoformat('2019-12-01'))


def team_size_lfc_nov_19():
    return TeamSize(team=TEAM_LFC, team_size=1, datum=date.fromisoformat('2019-11-01'))


def team_size_lfc_dec_19():
    return TeamSize(team=TEAM_LFC, team_size=1, datum=date.fromisoformat('2019-12-01'))
