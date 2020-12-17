from dataclasses import dataclass
from decimal import Decimal
from typing import Optional

from dataclasses_json import dataclass_json

from libs import Value


@dataclass_json
@dataclass
class Emission:
    co2e: Decimal
    compensatedCo2e: Decimal


@dataclass_json
@dataclass
class TransportStat:
    emission: Emission
    distance: Decimal
    monetaryCo2e: Decimal
    emissionPerCapita: Emission


@dataclass_json
@dataclass
class TotalStat(TransportStat):
    ratio: Value


@dataclass_json
@dataclass
class StatsResponse:
    train: Optional[TransportStat]
    taxi: Optional[TransportStat]
    plane: Optional[TransportStat]
    total: TotalStat
