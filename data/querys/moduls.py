from pydantic import BaseModel
from fastapi import Form, File, UploadFile
from typing import Optional, Any


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
    email: str


class UserUpdate(BaseModel):
    name: str
    credits: int = 200
    groups: list[str] = []
    price: int | None = None
    languages: list[str] = []



class AddTask:
    def __init__(
            self,
            title: str = Form(...),
            user_name: str = Form(...),
            price: int = Form(...),
            languages: str = Form("Python"),
            description: Optional[str] = Form(None),
            groups: str = Form("public"),
            code: Optional[str] = Form(None),
            file: Optional[UploadFile] = File(None)
    ):
        self.title = title
        self.user_name = user_name
        self.price = price
        self.languages = languages
        self.description = description
        self.groups = groups
        self.code = code
        self.file = file


# מודל בסיסי לתגובה חיובית
class SuccessResponse(BaseModel):
    ok: bool = True
    user: Optional[Any] = None

# מודל בסיסי לשגיאה
class ErrorResponse(BaseModel):
    ok: bool = False
    error: str

# מודל ספציפי למשתמש (לשימוש בתוך ה-SuccessResponse)
class UserSchema(BaseModel):
    id: int
    username: str

# מודל לכניסה (Login)
class LoginSchema(BaseModel):
    username: str
    password: str
