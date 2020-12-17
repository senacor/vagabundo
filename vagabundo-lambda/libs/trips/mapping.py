from libs.db import Trip, TransportType
from .trip_dto import TripResponse


def from_trip_entity_to_trip_response(trip: Trip) -> TripResponse:
    start_location = trip.origin.street_number if trip.transport == TransportType.TAXI else trip.origin.station
    end_location = trip.destination.street_number if trip.transport == TransportType.TAXI else trip.destination.station
    return TripResponse(id=trip.id, travellerId=trip.traveller_id, startLocation=start_location,
                        endLocation=end_location,
                        startTime=trip.origin.time_point.isoformat(), endTime=trip.destination.time_point.isoformat(),
                        team=trip.team, emission=float(trip.co2e), transport=trip.transport,
                        distance=float(trip.distance))
