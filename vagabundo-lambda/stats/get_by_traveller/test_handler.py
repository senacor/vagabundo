from assertpy import assert_that

from libs.stats import StatsResponse as Response
from stats.get_by_traveller.function.app import lambda_handler


def test_calculate_stats_for_harry_potter_correctly():
    event = {
        "queryStringParameters": {
            "fromDate": "2019-11-01",
            "toDate": "2019-12-31T23:59:00"
        },
        "pathParameters": {
            "travellerName": "hpotter"
        },
    }
    ret = lambda_handler(event, "")
    assert_that(ret["statusCode"]).is_equal_to(200)
    res: Response = Response.from_json(ret["body"])

    # taxi
    assert_that(res.taxi.emission.co2e).is_close_to(50, 0)
    assert_that(res.taxi.emission.compensatedCo2e).is_close_to(0, 0)
    assert_that(res.taxi.distance).is_close_to(71.75, 0)
    assert_that(res.taxi.monetaryCo2e).is_close_to(1.15, 0.0001)
    assert_that(res.taxi.emissionPerCapita.co2e).is_close_to(50, 0)
    assert_that(res.taxi.emissionPerCapita.compensatedCo2e).is_close_to(0, 0)

    # train
    assert_that(res.train.emission.co2e).is_close_to(100, 0)
    assert_that(res.train.emission.compensatedCo2e).is_close_to(0, 0)
    assert_that(res.train.distance).is_close_to(100.25, 0)
    assert_that(res.train.monetaryCo2e).is_close_to(2.3, 0.0001)
    assert_that(res.train.emissionPerCapita.co2e).is_close_to(100, 0)
    assert_that(res.train.emissionPerCapita.compensatedCo2e).is_close_to(0, 0)

    # plane
    assert_that(res.plane.emission.co2e).is_close_to(200, 0)
    assert_that(res.plane.emission.compensatedCo2e).is_close_to(0, 0)
    assert_that(res.plane.distance).is_close_to(678.53, 0.001)
    assert_that(res.plane.monetaryCo2e).is_close_to(4.6, 0.0001)
    assert_that(res.plane.emissionPerCapita.co2e).is_close_to(200, 0)
    assert_that(res.plane.emissionPerCapita.compensatedCo2e).is_close_to(0, 0)

    # total
    assert_that(res.total.emission.co2e).is_close_to(350, 0)
    assert_that(res.total.emission.compensatedCo2e).is_close_to(0, 0)
    assert_that(res.total.distance).is_close_to(850.53, 0.001)
    assert_that(res.total.monetaryCo2e).is_close_to(8.05, 0.0001)
    assert_that(res.total.emissionPerCapita.co2e).is_close_to(350, 0)
    assert_that(res.total.emissionPerCapita.compensatedCo2e).is_close_to(0, 0)
    assert_that(res.total.ratio.value).is_close_to(0.82608, 0.001)


def test_get_404_no_traveller_could_be_found():
    event = {
        "pathParameters": {
            "travellerName": "not_a_traveller"
        },
    }
    ret = lambda_handler(event, "")
    assert_that(ret["statusCode"]).is_equal_to(404)


def test_get_400_because_no_traveller_was_given():
    ret = lambda_handler({}, "")
    assert_that(ret["statusCode"]).is_equal_to(400)
