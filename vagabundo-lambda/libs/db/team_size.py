from sqlalchemy import Column, Integer, String, Date

from .base import Base


class TeamSize(Base):
    __tablename__ = 'team_size'
    id = Column(Integer, primary_key=True)
    team = Column(String(255), nullable=False)
    team_size = Column(Integer)
    datum = Column(Date)

    def __repr__(self):
        values = ', '.join("%s=%s" % item for item in vars(self).items() if item[0] != "_sa_instance_state")
        return "<TeamSize(%s)>" % values
