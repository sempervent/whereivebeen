from os import getenv

from databases import Database
from sqlalchemy import create_engine, MetaData


def make_db_url(protocol='postgresql+asyncpg',
                user=getenv('DB_USER', 'postgres'),
                password=getenv('DB_PASSWORD', 'postgres'),
                host=getenv('DB_HOST', 'localhost'),
                port=getenv('DB_PORT', '5432'),
                db_name=getenv('DB_NAME', 'postgres')) -> str:
    return f'{protocol}://{user}:{password}@{host}:{port}/{db_name}'


DATABASE_URL = make_db_url()
database = Database(DATABASE_URL)
metadata = MetaData()
engine = create_engine(make_db_url(protocol='postgresql'))
