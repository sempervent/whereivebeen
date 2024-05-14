from fastapi import HTTPException
from sqlalchemy.orm import Session
from loguru import logger

from .models import User, County


def get_user_and_county(db: Session, user_id: int, county_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    county_id_str = str(county_id).zfill(5)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if county := db.query(County).filter(County.fips == county_id_str).first():
        return user, county
    # raise HTTPException(status_code=404, detail="County not found")
    logger.error(f"County with id {county_id} not found")
    return user, None


def add_county_to_user(db: Session, user_id: int, county_id: int):
    try:
        county_id_str = str(county_id).zfill(5)
        user = db.query(User).filter(User.id == user_id).one_or_none()
        county = db.query(County).filter(County.fips == county_id_str).one_or_none()
        if county is None:
            county = County(fips=county_id_str)
            db.add(county)
            db.commit()
        if county in user.counties:
            logger.info("County already in user's list")
            return None
        user.counties.append(county)
        db.commit()
    except Exception as e:
        logger.error(f"Error adding county to user: {e}")
        raise HTTPException(
            status_code=500, detail="Error adding county to user"
        ) from e


def remove_county_from_user(db: Session, user_id: int, county_id: int):
    user, county = get_user_and_county(db, user_id, county_id)
    if county is None:
        return None
    if county in user.counties:
        user.counties.remove(county)
        db.commit()
