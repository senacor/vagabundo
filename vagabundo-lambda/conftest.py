"""
A global test-fixture - Used to handle the database in a somewhat efficient manner. Currently sqlite and
a my-sql, run in a test-container, are supported databases for testing
"""

import logging
import os
from unittest import mock

import pytest
from sqlalchemy import create_engine
from testcontainers.mysql import MySqlContainer

from libs_testing import DbHelper

LOGGER = logging.getLogger(__name__)


def pytest_addoption(parser):
    """
    Sets the request option '--test-containers' to true, if pytest is started with --test-containers

    Attention:
    At the end of a test-run with test-containers a error message occurs:
    pymysql.err.OperationalError: (2013, 'Lost connection to MySQL server during query')
    Currently I am not sure, why that is the case
    :param parser:
    """

    parser.addoption("--test-containers", action="store_true", default=False)


@pytest.fixture(scope="session", autouse=True)
def with_db(request):
    """
    Creates the database accordingly
    :param request:
    :return:
    """

    test_containers = request.config.getoption("--test-containers")
    my_sql = None
    if test_containers:
        my_sql = MySqlContainer('mysql:5.7.17')
        my_sql.start()
        url = my_sql.get_connection_url()
        engine = create_engine(url)
    else:
        url = 'sqlite:///.test.db'
        engine = create_engine(url)
    mock.patch.dict(os.environ, {"DB_HOST": url}).start()
    mock.patch.dict(os.environ, {"MONETARY_CO2E_FACTOR": "0.023"}).start()
    mock.patch.dict(os.environ, {"BRANCH_CO2E_PER_CAPITA_PER_DAY": "7.1781"}).start()
    return DbHelper(engine, my_sql)


@pytest.fixture(scope="function", autouse=True)
def clean_up(with_db):
    """
    repopulating the database before a test is executed
    if the underlying test data gets unmaintainable, each test should handle the database state by themself
    :param with_db:
    """

    LOGGER.info("Repopulating the database...")
    with_db.delete_all()
    with_db.insert_test_data()
