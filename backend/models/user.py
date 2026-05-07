from pydantic import BaseModel, Field, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserInDB(BaseModel):
    username: str
    name: str
    hash_password: str
    email: EmailStr