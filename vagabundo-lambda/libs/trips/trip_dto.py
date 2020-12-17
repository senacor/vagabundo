from dataclasses import dataclass

from dataclasses_json import dataclass_json


@dataclass_json
@dataclass
class TripResponse:
    id: int
    travellerId: int
    startLocation: str
    endLocation: str
    startTime: str
    endTime: str
    team: str
    emission: float
    transport: str
    distance: float
