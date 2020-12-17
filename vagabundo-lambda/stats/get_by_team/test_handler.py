from assertpy import assert_that

from libs.stats import StatsResponse as Response
from stats.get_by_team.function.app import lambda_handler


def test_calculate_stats_for_fnc_19_correctly():
    event = {
        "queryStringParameters": {
            "fromDate": "2019-11-01",
            "toDate": "2019-12-31"
        },
        "pathParameters": {
            "teamName": "FNC"
        },

    }
    ret = lambda_handler(event, "")
    assert_that(ret["statusCode"]).is_equal_to(200)
    res: Response = Response.from_json(ret["body"])

    # taxi
    assert_that(res.taxi).is_none()

    # train -- luke_skywalker_from_nuernberg_to_berlin
    assert_that(res.train.emission.co2e).is_close_to(125, 0)
    assert_that(res.train.emission.compensatedCo2e).is_close_to(0, 0)
    assert_that(res.train.distance).is_close_to(732.07, 0.0001)
    assert_that(res.train.monetaryCo2e).is_close_to(2.875, 0.0001)
    assert_that(res.train.emissionPerCapita.co2e).is_close_to(31.25, 0)
    assert_that(res.train.emissionPerCapita.compensatedCo2e).is_close_to(0, 0)

    # plane -- han_solo_one_way_plane
    assert_that(res.plane.emission.co2e).is_close_to(50, 0)
    assert_that(res.plane.emission.compensatedCo2e).is_close_to(0, 0)
    assert_that(res.plane.distance).is_close_to(512, 0.001)
    assert_that(res.plane.monetaryCo2e).is_close_to(1.15, 0.0001)
    assert_that(res.plane.emissionPerCapita.co2e).is_close_to(12.50, 0)
    assert_that(res.plane.emissionPerCapita.compensatedCo2e).is_close_to(0, 0)

    # total
    assert_that(res.total.emission.co2e).is_close_to(175, 0)
    assert_that(res.total.emission.compensatedCo2e).is_close_to(0, 0)
    assert_that(res.total.distance).is_close_to(1244.07, 0.001)
    assert_that(res.total.monetaryCo2e).is_close_to(4.025, 0.0001)
    assert_that(res.total.emissionPerCapita.co2e).is_close_to(87.50, 0)  # two people and two months
    assert_that(res.total.emissionPerCapita.compensatedCo2e).is_close_to(0, 0)
    assert_that(res.total.ratio.value).is_close_to(0.1052, 0.001)


def test_get_404_no_data_for_team_could_be_found():
    event = {
        "pathParameters": {
            "teamName": "ThisIsNotATeam"
        },
    }
    ret = lambda_handler(event, "")
    assert_that(ret["statusCode"]).is_equal_to(404)


def test_get_400_because_no_team_was_given():
    ret = lambda_handler({}, "")
    assert_that(ret["statusCode"]).is_equal_to(400)
