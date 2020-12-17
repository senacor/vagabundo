from sqlalchemy import Column, Integer, String, DateTime

from .base import Base


class TripPosition(Base):
    __tablename__ = 'trip_position'
    id = Column(Integer, primary_key=True)
    street_number = Column(String(255), name="street_and_number")
    city = Column(String(255), name="city")
    postal_code = Column(String(255))
    country = Column(String(255))
    time_point = Column(DateTime)
    station = Column(String(255))
    station_code = Column(String(255))

    def __repr__(self):
        values = ', '.join("%s=%s" % item for item in vars(self).items() if item[0] != "_sa_instance_state")
        return "<TripPosition(%s)>" % values
