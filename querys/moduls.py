from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    user_name: str
    languages: list[str]
    description: str | None = None
    groups: list[str] = ["public"]    
    price: int