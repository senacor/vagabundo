from assertpy import assert_that

from libs.travellers import TravellerResponse as Response
from libs_testing.data import harry_potter
from travellers.get_by_username.function.app import lambda_handler


def test_find_harry_potter():
    event = {
        "pathParameters": {
            "travellerName": "hpotter"
        },
    }
    ret = lambda_handler(event, "")
    assert_that(ret["statusCode"]).is_equal_to(200)

    hp = harry_potter()
    res: Response = Response.from_json(ret["body"])
    assert_that(res.firstName).is_equal_to(hp.first_name)
    assert_that(res.lastName).is_equal_to(hp.last_name)
    assert_that(res.team).is_equal_to(hp.current_team)
    assert_that(res.bk).is_equal_to(hp.bk)


def test_get_404_no_traveller_could_be_found():
    event = {
        "pathParameters": {
            "travellerName": "idonotexist"
        },
    }
    ret = lambda_handler(event, "")
    assert_that(ret["statusCode"]).is_equal_to(404)


def test_get_400_because_no_traveller_was_given():
    ret = lambda_handler({}, "")
    assert_that(ret["statusCode"]).is_equal_to(400)
