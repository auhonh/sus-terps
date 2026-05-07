from fastapi import FastAPI
from database import app as db_app, user_coll, act_coll

import os  # reads environment variables
from dotenv import load_dotenv  # loads .env values into environment variables
# create app, throw API errors, gives readable HTTP status codes
from fastapi import FastAPI, HTTPException, status
# for returning raw responses instead of JSON
from fastapi.responses import Response
from typing import List  # type hints in python

app = db_app # utilize app configured in database

@app.post("/new-user", status_code=status.HTTP_201_CREATED)
async def create_user(user: dict):
    # for "new user" page
    print(f"Creating user: {user}")
    return {"message": "user created"}

@app.post("/login")
async def login(credentials: dict):
    return {"message": "login successful"}

@app.get("/user/{user_id}")
async def get_profile(user_id: str):
    return {"name": "Test Terp", "points": 0}