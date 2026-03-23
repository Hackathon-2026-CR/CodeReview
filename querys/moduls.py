from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    user_name: str
    languages: str
    description: str | None = None
    groups: list
    status: str
    reviewer: str
    price: int