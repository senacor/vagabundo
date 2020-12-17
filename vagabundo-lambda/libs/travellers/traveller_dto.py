from dataclasses import dataclass

from dataclasses_json import dataclass_json


@dataclass_json
@dataclass
class TravellerResponse:
    firstName: str
    lastName: str
    bk: str
    team: str
