import os  # reads environment variables

# create app
from fastapi import FastAPI

# allows backend to accept frontend requests
from fastapi.middleware.cors import CORSMiddleware

from bson import ObjectId  # convert string IDs to ObjectIDs for MongoDB
from pymongo import AsyncMongoClient
from pymongo import ReturnDocument  # used for updating documents
from dotenv import load_dotenv  # loads .env values into environment variables

load_dotenv()
MONGO_URI = os.environ["MONGO_URI"]  # obtaining credentials to access database

# start up FastAPI and provide documentation info
app = FastAPI(
    title="Sus Terps",
    summary="An application that allows user to record their sustainability efforts.",
)

# ensuring frontend can call the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# connects to MongoDB
client = AsyncMongoClient(MONGO_URI)
db = client[os.environ["DB_NAME"]]
user_coll = db.get_collection("users")
act_coll = db.get_collection("activities")
