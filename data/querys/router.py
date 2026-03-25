from fastapi import APIRouter, Depends, HTTPException
from data.querys import dal
from data.querys.moduls import AddTask, UserCreate, UserUpdate, LoginSchema, SuccessResponse, ErrorResponse, UserSchema

router = APIRouter(
    prefix="/api/tasks",
    tags=["tasks"]
)


@router.get('/users/{user_name}')
def get_user_info(user_name):
    return dal.get_user(user_name)


@router.get('/my-tasks/{user_name}')
def get_tasks_created_by_user(user_name):
    return dal.published_codes(user_name)


@router.get('/working-tasks/{reviwer_name}')
def get_tasks_the_user_is_currently_working_on(reviwer_name):
    return dal.working_on(reviwer_name)


@router.get('/finished-tasks/{reviwer_name}')
def get_tasks_the_user_has_finished(reviwer_name):
    return dal.finished(reviwer_name)


@router.get('/all-tasks/{user_name}')
def get_all_tasks(user_name):
    return dal.get_available_by_user(user_name)


@router.get('/{id}')
def get_task_using_id(id):
    return dal.get_full_task_by_id(id)


@router.post('/add-task')
async def add_task_with_file(task: AddTask = Depends()):
    return dal.add_task_manually(task)


@router.post('/add-user')
async def add_user(user: UserCreate = Depends()):
    return dal.add_to_users(user)


@router.post('/update-user')
async def update_user(user: UserUpdate = Depends()):
    return dal.update_user_profile(user)


@router.post("/login",
             response_model=SuccessResponse,
             responses={401: {"model": ErrorResponse}})
def login(credentials: LoginSchema):
    user_data = dal.get_user(credentials.username)

    if not user_data or user_data['password'] != credentials.password:
        raise HTTPException(
            status_code=401,
            detail={"ok": False, "error": "Invalid credentials"}
        )

    # החזרה של המבנה הכללי עם הנתונים הספציפיים
    return {
            "ok": True,
            "data": {
                "id": user_data['id'],
                "username": user_data['name']
            }
        }
