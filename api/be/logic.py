from fastapi import HTTPException
from sqlalchemy.orm import Session
from loguru import logger

from .models import User, County


def get_user_and_county(db: Session, user_id: int, county_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if county := db.query(County).filter(County.id == county_id).first():
        return user, county
    # raise HTTPException(status_code=404, detail="County not found")
    logger.error(f"County with id {county_id} not found")
    return user, None


def add_county_to_user(db: Session, user_id: int, county_id: int):
    user, county = get_user_and_county(db, user_id, county_id)
    if county is None:
        return None
    logger.info(f"Adding county {county.name} to user {user.username}")
    if county not in user.counties:
        user.counties.append(county)
        db.commit()


def remove_county_from_user(db: Session, user_id: int, county_id: int):
    user, county = get_user_and_county(db, user_id, county_id)
    if county is None:
        return None
    if county in user.counties:
        user.counties.remove(county)
        db.commit()
