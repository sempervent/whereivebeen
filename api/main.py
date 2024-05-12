from fastapi import FastAPI, HTTPException, Depends, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from loguru import logger

from be.db import database, get_db, engine
from be.auth import verify_password, create_access_token, get_password_hash, pwd_context
from be.models import User, County, UserCreate, Base
from be.logic import add_county_to_user, remove_county_from_user

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Where I've Been API",
    description="This API allows users to manage counties and user interactions for the County Selector app.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API endpoints
@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    logger.info(f"{form_data.username} is logging in")
    user = db.query(User).filter(User.username == form_data.username).first()
    logger.info(f"User: {user}")
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username})
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
async def api_add_county_to_user(
    user_id: int, county_id: int, db: Session = Depends(get_db)
):
    try:
        add_county_to_user(db, user_id, county_id)
        return {"message": "County added to user"}
    except HTTPException as e:
        raise e


@app.delete("/users/{user_id}/counties/{county_id}")
async def api_remove_county_from_user(
    user_id: int, county_id: int, db: Session = Depends(get_db)
):
    try:
        remove_county_from_user(db, user_id, county_id)
        return {"message": "County removed from user"}
    except HTTPException as e:
        raise e


@app.get("/users/{user_id}/counties")
async def list_user_counties(user_id: int, db: Session = Depends(get_db)):
    if user := db.query(User).filter(User.id == user_id).first():
        return {
            "counties": [
                {"id": county.id, "fips_code": county.fips_code, "name": county.name}
                for county in user.counties
            ]
        }
    else:
        raise HTTPException(status_code=404, detail="User not found")


@app.post("/register", response_model=UserCreate)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if (
        db_user := db.query(User)
        .filter(User.username == user.username)
        .first()
    ):
        raise HTTPException(status_code=400, detail="Username already registered")

    # Hash the user's password
    hashed_password = pwd_context.hash(user.password)

    # Create new user instance
    new_user = User(
        username=user.username,
        hashed_password=hashed_password
    )

    # Add to the database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"username": new_user.username, "id": new_user.id}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
