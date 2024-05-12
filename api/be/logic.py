from fastapi import HTTPException
from sqlalchemy.orm import Session

from .models import User, County


def get_user_and_county(db: Session, user_id: int, county_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if county := db.query(County).filter(County.id == county_id).first():
        return user, county
    else:
        raise HTTPException(status_code=404, detail="County not found")


def add_county_to_user(db: Session, user_id: int, county_id: int):
    user, county = get_user_and_county(db, user_id, county_id)
    if county not in user.counties:
        user.counties.append(county)
        db.commit()


def remove_county_from_user(db: Session, user_id: int, county_id: int):
    user, county = get_user_and_county(db, user_id, county_id)
    if county in user.counties:
        user.counties.remove(county)
        db.commit()
