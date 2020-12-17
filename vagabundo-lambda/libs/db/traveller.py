from sqlalchemy import Column, Integer, String

from .base import Base


class Traveller(Base):
    __tablename__ = 'traveller'
    id = Column(Integer, primary_key=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    bk = Column(String(255), nullable=False)
    current_team = Column(String(255))

    def __repr__(self):
        values = ', '.join("%s=%s" % item for item in vars(self).items() if item[0] != "_sa_instance_state")
        return "<Traveller(%s)>" % values
