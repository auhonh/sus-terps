from fastapi import FastAPI
# create app, throw API errors, gives readable HTTP status codes
from fastapi import FastAPI, HTTPException, status
# for returning raw responses instead of JSON
from fastapi.responses import Response

import models.user
from typing import List, Union, Annotated, Literal  # type hints in python
from database import app as db_app, user_coll, act_coll
from dotenv import load_dotenv  # loads .env values into environment variables

import os  # reads environment variables
import bcrypt # to encrypt user passwords, salt and hash

from models.user import UserCreate, UserInDB, UserBase, UserPublic
from models.base import BaseActivity
from pydantic import model_validator, Field

from models.activities import (
    WalkCycle, ShuttleMetro, Carpool, Compost,
    Recycle, EWaste, EatVeganMeal, ColdShower,
    LaptopReduc, ReusableBag
)

ActivityUnion = Union[
    WalkCycle, ShuttleMetro, Carpool, Compost, 
    Recycle, EWaste, EatVeganMeal, ColdShower, 
    LaptopReduc, ReusableBag
]

DiscriminatoryUnion = Annotated[ActivityUnion, Field(discriminator="activity_type")]

app = db_app # utilize app configured in database

# ensures bare passwords are not stored in database
def create_hashed_pw(password: str) -> str:
    # prepping password to hash
    bytes = password.encode('utf-8') # encode into binary bytes
    salt = bcrypt.gensalt()
    hashed_pw = bcrypt.hashpw(bytes, salt)

    return hashed_pw.decode('utf-8') # decode into str

# provided password is valid if it matches existing hashed password
def verify_pw(plain_pw: str, hashed_pw: str) -> bool:
    plain_bytes = plain_pw.encode('utf-8')
    hash_bytes = hashed_pw.encode('utf-8')

    return bcrypt.checkpw(plain_bytes, hash_bytes)

@app.post(
    "/new-user",
    response_description="Add new user",
    response_model=UserPublic,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def create_user(user: UserCreate):
    # determining if user already exists before creating
    user_exist = await user_coll.find_one({"$or": [{"email": user.email}, 
    {"username": user.username}]})

    if user_exist:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email or username provided is already registered. Attempt login instead."
        )

    # hash and salt password for security
    hash_pw = create_hashed_pw(user.password)

    # take info given and feed it into final model for database
    user_dict = user.model_dump(exclude={"password", "user_id"})
    new_user = UserInDB(**user_dict, hash_password=hash_pw)

    # insert user, obtain the ID given by mongo and record it
    result = await user_coll.insert_one(new_user.model_dump(exclude={"user_id"}))
    new_user.user_id = str(result.inserted_id) # record given id

    return UserPublic(**user_dict, user_id=str(result.inserted_id))

@app.post(
    "/login",
    response_description="Check user credentials for login",
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
    response_model_by_alias=False,)
async def login(data: UserBase):
    # search for user in database
    user = await user_coll.find_one({"username": data.username})

    # handle user not in database
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username"
        )

    # verify password in association with username
    if not verify_pw(data.password, user["hash_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password"
        )

    # ensure proper id is associated with the returned user
    user["user_id"] = str(user["_id"])
    return user

@app.post(
    "/log-activity",
    response_description="Log a new user activity and update statistics",
    status_code=status.HTTP_201_CREATED,
)
async def log_activity(activity: DiscriminatoryUnion):
    # identify and validate activity
    act_dict = activity.model_dump()

    # update user statistics
    points = activity.base_points or 0
    co2 = activity.co2_saved_lbs or 0
    
    user = await user_coll.find_one({"username": activity.username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # record activity in collection
    await act_coll.insert_one(act_dict)
    
    new_points = user.get("total_points", 0) + points
    new_co2 = user.get("total_co2", 0) + co2
    
    # level calculation formula
    new_level = int((new_points / 10)**0.5) + 1
    
    await user_coll.update_one(
        {"username": activity.username},
        {"$set": {
            "total_points": new_points,
            "total_co2": new_co2,
            "level": new_level
        }}
    )
    
    return {"status": "success", "points_earned": points, 
    "new_total": new_points, "level": new_level}


@app.get(
    "/user/{username}",
    response_description="Retrieve user profile data and recent activity history",
    response_model=dict,
    status_code=status.HTTP_200_OK
)
async def get_profile(username: str):
    # grab user to provide information
    user = await user_coll.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # fetch recent history (last 10 activities), descending order
    cursor = act_coll.find({"username": username}).sort("timestamp", -1).limit(10)
    history = await cursor.to_list(length=10)
    
    # convert mongoDB ObjectIDs and datetime for JSON
    for item in history:
        item["_id"] = str(item["_id"])
        item["timestamp"] = item["timestamp"].isoformat()

    return {
        "name": user["name"],
        "total_points": user.get("total_points", 0),
        "total_co2": user.get("total_co2", 0),
        "level": user.get("level", 1),
        "history": history
    }
