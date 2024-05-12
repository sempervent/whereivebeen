
from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from .db import metadata, engine


Base = declarative_base(metadata=metadata)

user_counties = Table(
    'user_counties', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('county_id', Integer, ForeignKey('counties.id'), primary_key=True)
)


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    counties = relationship('County', secondary=user_counties, back_populates='users')


class County(Base):
    __tablename__ = 'counties'

    id = Column(Integer, primary_key=True)
    fips = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    users = relationship('User', secondary=user_counties, back_populates='counties')
