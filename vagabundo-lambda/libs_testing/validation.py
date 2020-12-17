from assertpy import assert_that

from libs.db import Trip
from libs.trips import TripResponse


def validate_non_taxi_trips_against_trip(res: TripResponse, trip: Trip):
    assert_that(res.team).is_equal_to(trip.team)
    assert_that(res.startLocation).is_equal_to(trip.origin.station)
    assert_that(res.endLocation).is_equal_to(trip.destination.station)
    assert_that(res.distance).is_close_to(trip.distance, 0.1)
    assert_that(res.emission).is_close_to(trip.co2e, 0.1)


def validate_taxi_trips_against_trip(res: TripResponse, trip: Trip):
    assert_that(res.team).is_equal_to(trip.team)
    assert_that(res.startLocation).is_equal_to(trip.origin.street_number)
    assert_that(res.endLocation).is_equal_to(trip.destination.street_number)
    assert_that(res.distance).is_close_to(trip.distance, 0.1)
    assert_that(res.emission).is_close_to(trip.co2e, 0.1)
