from assertpy import assert_that

from libs.stats import StatsResponse as Response
from stats.get.function.app import lambda_handler


def test_stats_for_company_are_calculated_correctly():
    event = {
        "queryStringParameters": {
            "fromDate": "2019-11-01",
            "toDate": "2019-12-31T23:59:00"
        },
    }
    ret = lambda_handler(event, "")
    assert_that(ret["statusCode"]).is_equal_to(200)
    res: Response = Response.from_json(ret["body"])

    # train -- luke_skywalker_from_nuernberg_to_berlin + harry_potter_one_way_train_trip
    assert_that(res.train.emission.co2e).is_close_to(225, 0)
    assert_that(res.train.emission.compensatedCo2e).is_close_to(0, 0)
    assert_that(res.train.distance).is_close_to(832.32, 0.0001)
    assert_that(res.train.monetaryCo2e).is_close_to(5.175, 0.0001)
    assert_that(res.train.emissionPerCapita.co2e).is_close_to(37.50, 0)
    assert_that(res.train.emissionPerCapita.compensatedCo2e).is_close_to(0, 0)

    # plane -- han_solo_one_way_plane + harry_potter_one_way_flight
    assert_that(res.plane.emission.co2e).is_close_to(250, 0)
    assert_that(res.plane.emission.compensatedCo2e).is_close_to(0, 0)
    assert_that(res.plane.distance).is_close_to(1190.53, 0.001)
    assert_that(res.plane.monetaryCo2e).is_close_to(5.75, 0.0001)
    assert_that(res.plane.emissionPerCapita.co2e).is_close_to(41.6667, 0.0001)
    assert_that(res.plane.emissionPerCapita.compensatedCo2e).is_close_to(0, 0)

    # taxi -- harry_potter_one_way_taxi + son_goku_one_way_taxi
    assert_that(res.taxi.emission.co2e).is_close_to(100, 0)
    assert_that(res.taxi.emission.compensatedCo2e).is_close_to(0, 0)
    assert_that(res.taxi.distance).is_close_to(143.50, 0)
    assert_that(res.taxi.monetaryCo2e).is_close_to(2.3, 0.0001)
    assert_that(res.taxi.emissionPerCapita.co2e).is_close_to(16.6667, 0.0001)
    assert_that(res.taxi.emissionPerCapita.compensatedCo2e).is_close_to(0, 0)

    # total
    assert_that(res.total.emission.co2e).is_close_to(575, 0)
    assert_that(res.total.emission.compensatedCo2e).is_close_to(0, 0)
    assert_that(res.total.distance).is_close_to(2166.35, 0.001)
    assert_that(res.total.monetaryCo2e).is_close_to(13.225, 0.0001)
    assert_that(res.total.emissionPerCapita.co2e).is_close_to(191.6667, 0.0001)
    assert_that(res.total.emissionPerCapita.compensatedCo2e).is_close_to(0, 0)
    assert_that(res.total.ratio.value).is_close_to(0.44606, 0.0001)


def test_no_stats_available_return_404():
    event = {
        "queryStringParameters": {
            "fromDate": "2021-11-01",
            "toDate": "2021-12-31T23:59:00"
        },
    }
    ret = lambda_handler(event, "")
    assert_that(ret["statusCode"]).is_equal_to(404)
