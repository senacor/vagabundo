import logging
from typing import Optional

from sqlalchemy.orm import sessionmaker
from testcontainers.core.generic import DbContainer

from libs.db import TripPosition, Trip, Traveller, TeamSize
from libs.db.base import Base
from libs_testing import data

LOGGER = logging.getLogger(__name__)


class DbHelper:
    def __init__(self, engine, tc: Optional[DbContainer]):
        self.engine = engine
        Base.metadata.create_all(engine)
        self.session = sessionmaker(bind=engine)()
        self.tc = tc

    def delete_all(self):
        self.session.query(Trip).delete()
        self.session.query(TripPosition).delete()
        self.session.query(Traveller).delete()
        self.session.query(TeamSize).delete()
        self.session.commit()

    def insert_test_data(self):
        session = self.session
        hp = data.harry_potter()
        ls_for, ls_back = data.luke_skywalker_round_train_trip()

        entities = [
            # Trips
            # Harry Potter
            data.harry_potter_one_way_taxi(hp),
            data.harry_potter_one_way_flight(hp),
            data.harry_potter_one_way_train_trip(hp),
            data.harry_potter_2018_one_way_flight(hp),

            data.han_solo_one_way_plane(),
            ls_for,
            ls_back,
            data.son_goku_one_way_taxi(),

            # TeamSize
            data.team_size_lfc_nov_19(),
            data.team_size_lfc_dec_19(),
            data.team_size_fnc_nov_19(),
            data.team_size_fnc_dec_19(),
        ]

        for entity in entities:
            session.add(entity)

        session.commit()

    def __del__(self):
        if self.tc:
            LOGGER.info("Shutting down the test-container")
            self.session.close()
            self.tc.stop()
