import pytest
from assertpy import assert_that
from freezegun import freeze_time

from libs.trips import TripResponse as Response
from libs_testing import validate_non_taxi_trips_against_trip
from libs_testing.data import harry_potter_2018_one_way_flight
from trips.get_by_team.function.app import lambda_handler


@pytest.mark.parametrize("event, time", [
    # 1
    ({
        "queryStringParameters": {
            "fromDate": "2018-12-01T00:00:00",
            "toDate": "2018-12-31",
        },
        "pathParameters": {
            "teamName": "DEU"
        },
    }, "2019-01-01"),

    # 2
    ({
        "queryStringParameters": {
            "fromDate": "2018-12-01T00:00:00",
        },
        "pathParameters": {
            "teamName": "DEU"
        },
    }, "2018-10-03"),

    # 3
    ({
        "queryStringParameters": {
            "toDate": "2018-12-31",
        },
        "pathParameters": {
            "teamName": "DEU"
        },
    }, "2018-10-03"),

    # 4
    ({
        "pathParameters": {
            "teamName": "DEU"
        },
    }, "2018-10-03")
])
def test_get_the_trip_in_december_2018_of_team_deu(event, time):
    with freeze_time(time):
        ret = lambda_handler(event, "")
    assert_that(ret["statusCode"]).is_equal_to(200)

    trips = Response.schema().loads(ret["body"], many=True)
    assert_that(trips).is_length(1)
    validate_non_taxi_trips_against_trip(trips[0], harry_potter_2018_one_way_flight())


@freeze_time("2017-01-01")
def test_get_no_trips_for_2017():
    event = {
        "pathParameters": {
            "teamName": "DEU"
        },
    }
    ret = lambda_handler(event, "")
    assert_that(ret["statusCode"]).is_equal_to(200)

    trips = Response.schema().loads(ret["body"], many=True)
    assert_that(trips).is_length(0)


@freeze_time("2019-08-07")
def test_get_two_trips_in_2019_of_team_fnc():
    event = {
        "pathParameters": {
            "teamName": "FNC"
        },
    }
    ret = lambda_handler(event, "")
    assert_that(ret["statusCode"]).is_equal_to(200)

    trips = Response.schema().loads(ret["body"], many=True)
    assert_that(trips).is_length(3)


def test_get_400_because_no_team_was_given():
    ret = lambda_handler({}, "")
    assert_that(ret["statusCode"]).is_equal_to(400)
