from pydantic import BaseModel, EmailStr

# basic information always required to identify a user
# also used for login
class UserBase(BaseModel):
    user_id: str | None = None
    username: str
    password: str

# information required to create a new user
class UserCreate(UserBase):
    name: str
    email: EmailStr

# user information stored in database
class UserInDB(BaseModel):
    user_id: str | None = None

    name: str
    email: EmailStr

    username: str
    hash_password: str

    # for stats tracking
    total_points: float = 0.0
    total_co2: float = 0.0
    level: int = 1

# user information returned after successful login
class UserPublic(BaseModel):
    user_id: str
    username: str
    name: str
    email: EmailStr
    