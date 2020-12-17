from libs.db import Traveller


def try_to_find_traveller(event, session) -> Traveller or dict:
    """
    Tries to find a traveller based on a given name in the event object
    :param event:
    :param session:
    :return:
    """
    try:
        traveller_name = event["pathParameters"]["travellerName"]
    except KeyError:
        return {
            "statusCode": 400,
            "body": "No traveller name given"
        }

    traveller = session.query(Traveller).filter(Traveller.bk == traveller_name).first()
    if not traveller:
        return {
            "statusCode": 404,
            "body": "Traveller not found"
        }
    return traveller

