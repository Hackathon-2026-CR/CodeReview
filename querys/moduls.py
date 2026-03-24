from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    user_name: str
    languages: list[str]
    description: str | None = None
    groups: list[str] = ["public"]    
    price: int


class UserCreate(BaseModel):
    name: str
    password: str
    credits: int = 200
    groups: list[str] = []
    price: int | None = None
    languages: list[str] = []