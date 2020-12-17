from sqlalchemy import Column, Integer, ForeignKey, DECIMAL, String, Enum
from sqlalchemy.orm import relationship

from .base import Base
from .transport_type import TransportType


class Trip(Base):
    __tablename__ = 'trip'
    id = Column(Integer, primary_key=True)
    origin_id = Column(Integer, ForeignKey('trip_position.id'))
    origin = relationship("TripPosition", primaryjoin="Trip.origin_id == TripPosition.id")
    destination_id = Column(Integer, ForeignKey('trip_position.id'))
    destination = relationship("TripPosition",  primaryjoin="Trip.destination_id == TripPosition.id", lazy='select')
    traveller_id = Column(Integer, ForeignKey('traveller.id'))
    traveller = relationship("Traveller", primaryjoin="Trip.traveller_id == Traveller.id", lazy='select')
    total_fare = Column(DECIMAL(6, 2))
    fare_currency = Column(String(3))
    distance = Column(DECIMAL(6, 2))
    operator = Column(String(255))
    team = Column(String(255))
    co2e = Column(DECIMAL(6, 2))
    compensated_co2e = Column(DECIMAL(6, 2))
    transport = Column(Enum(TransportType))
    booking_code = Column(String(255))

    def __repr__(self):
        values = ', '.join("%s=%s" % item for item in vars(self).items() if item[0] != "_sa_instance_state")
        return "<Trip(%s)>" % values
