import pytest
from assertpy import assert_that

from libs.db import Trip
from libs.trips import TripResponse as Response
from libs_testing import validate_non_taxi_trips_against_trip, validate_taxi_trips_against_trip
from libs_testing.data import harry_potter_one_way_flight, harry_potter_one_way_trip_id, luke_skywalker_for_id, \
    missing_trip_id, luke_skywalker_round_train_trip, luke_skywalker_back_id, son_goku_one_way_taxi_id, \
    son_goku_one_way_taxi
from trips.get_by_id.function.app import lambda_handler


@pytest.fixture()
def apigw_event(request):
    marker = request.node.get_closest_marker("trip_id")
    if marker is None:
        # Handle missing marker in some way...
        data = None
    else:
        data = marker.args[0]

    return {
        "pathParameters": {
            "id": data
        }
    }


@pytest.mark.trip_id(harry_potter_one_way_trip_id)
def test_flight_from_hamburg_to_london(apigw_event):
    ret = lambda_handler(apigw_event, "")
    assert_that(ret["statusCode"]).is_equal_to(200)
    res: Response = Response.from_json(ret["body"])
    hp_trip: Trip = harry_potter_one_way_flight()

    validate_non_taxi_trips_against_trip(res, hp_trip)


@pytest.mark.trip_id(luke_skywalker_for_id)
def test_train_from_berlin_to_nuernberg(apigw_event):
    ret = lambda_handler(apigw_event, "")
    assert_that(ret["statusCode"]).is_equal_to(200)
    res: Response = Response.from_json(ret["body"])
    ls_trip, _ = luke_skywalker_round_train_trip()

    validate_non_taxi_trips_against_trip(res, ls_trip)


@pytest.mark.trip_id(luke_skywalker_back_id)
def test_train_from_nuernberg_to_berlin(apigw_event):
    ret = lambda_handler(apigw_event, "")
    assert_that(ret["statusCode"]).is_equal_to(200)
    res: Response = Response.from_json(ret["body"])
    _, ls_trip = luke_skywalker_round_train_trip()

    validate_non_taxi_trips_against_trip(res, ls_trip)


@pytest.mark.trip_id(son_goku_one_way_taxi_id)
def test_taxi_from_berlin_to_leipzig(apigw_event):
    ret = lambda_handler(apigw_event, "")
    assert_that(ret["statusCode"]).is_equal_to(200)
    res: Response = Response.from_json(ret["body"])
    gs_trip = son_goku_one_way_taxi()

    validate_taxi_trips_against_trip(res, gs_trip)


@pytest.mark.trip_id(missing_trip_id)
def test_trip_not_found(apigw_event):
    ret = lambda_handler(apigw_event, "")
    data = ret["body"]
    assert_that(ret["statusCode"]).is_equal_to(400)
    assert_that(data).is_equal_to("Trip {} not found".format(missing_trip_id))
