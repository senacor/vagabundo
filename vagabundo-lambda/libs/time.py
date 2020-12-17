from datetime import datetime


def evaluate_time_range_default_to_current_year(event):
    """
    This function returns a from_date (start) and a to_date (end). If the event contain 'queryStringParameters.fromDate'
    and/or 'queryStringParameters.toDate' the input is iso-formatted.
    If the fromDate is missing, 00:00:00, 1. january of the current year is returned in iso-format.
    If the toDate is missing, 23:59:59, 31. december of the current year is returned in iso-format.
    :param event:
    :return:
    """
    qp = event.get("queryStringParameters")
    qp_from_date = qp.get("fromDate") if qp else None
    qp_to_date = qp.get("toDate") if qp else None
    from_date = datetime.fromisoformat(qp_from_date) if qp_from_date else datetime(datetime.now().year, 1, 1)
    to_date = datetime.fromisoformat(qp_to_date) if qp_to_date else datetime(datetime.now().year, 12, 31, 23, 59, 59)
    return from_date, to_date
