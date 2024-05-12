from fastapi import FastAPI, HTTPException, Depends, status, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session, sessionmaker

from be.auth import oauth2_scheme, pwd_context
from be.db import database, DATABASE_URL, engine
from be.settings import SECRET_KEY
from be.auth import verify_password, create_access_token, get_password_hash
from be.models import User, County

app = FastAPI(
    title="Where I've Been API",
    description="This API allows users to manage counties and user interactions for the County Selector app.",
    version="1.0.0"
)

SessionLocal = sessionmaker(autocmmit=False, autoflush=False, bind=engine)


# API endpoints
@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_query = User.select().where(User.c.username == form_data.username)
    user = await database.fetch_one(user_query)
    if not user or not verify_password(form_data.password, user['hashed_password']):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user['username']})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/counties/")
async def read_counties():
    query = County.select()
    return await database.fetch_all(query)


@app.get("/healthcheck")
def healthcheck():
    return {"status": "healthy"}


@app.get("/db-healthcheck")
async def db_healthcheck():
    try:
        await database.execute("SELECT 1")
        return {"db_status": "healthy"}
    except Exception as e:
        return {"db_status": "unhealthy", "error": str(e)}


@app.post("/users/", status_code=status.HTTP_201_CREATED)
async def create_user(username: str = Body(...), password: str = Body(...)):
    hashed_password = get_password_hash(password)
    query = User.insert().values(username=username, hashed_password=hashed_password)
    last_record_id = await database.execute(query)
    return {"username": username, "id": last_record_id}


@app.post("/users/{user_id}/counties/{county_id}")
async def add_county_to_user(user_id: int, county_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    county = db.query(County).filter(County.id == county_id).first()
    if not county:
        raise HTTPException(status_code=404, detail="County not found")
    if county not in user.counties:
        user.counties.append(county)
        db.commit()
    return {"message": "County added to user"}


@app.delete("/users/{user_id}/counties/{county_id}")
async def remove_county_from_user(user_id: int, county_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    county = db.query(County).filter(County.id == county_id).first()
    if not county:
        raise HTTPException(status_code=404, detail="County not found")
    user.counties.remove(county)
    db.commit()
    return {"message": "County removed from user"}


@app.get("/users/{user_id}/counties")
async def list_user_counties(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"counties": [{"id": county.id, "fips_code": county.fips_code, "name": county.name} for county in user.counties]}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)