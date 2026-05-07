from fastapi import FastAPI
# create app, throw API errors, gives readable HTTP status codes
from fastapi import FastAPI, HTTPException, status
# for returning raw responses instead of JSON
from fastapi.responses import Response

import models.user
from typing import List  # type hints in python
from database import app as db_app, user_coll, act_coll
from dotenv import load_dotenv  # loads .env values into environment variables

import os  # reads environment variables
import bcrypt # to encrypt user passwords, salt and hash

from models.user import UserCreate, UserInDB, UserBase, UserPublic
from models.base import BaseActivity


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
    response_model=UserInDB,
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

    return new_user

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

@app.get("/user/{user_id}")
async def get_profile(user_id: str):
    return {"name": "Test Terp", "points": 0}