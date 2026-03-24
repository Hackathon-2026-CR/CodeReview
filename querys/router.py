from fastapi import APIRouter, Form, File, UploadFile
from querys import dal
from querys.moduls import TaskCreate


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


@router.get('/working-tasks/{user_name}')
def get_tasks_the_user_is_currently_working_on(user_name):
    return dal.working_on(user_name)


@router.post('/add-task')
def add_task(task: TaskCreate):
    return dal.add_task_to_codes(task)

@router.post('/add-task_upload_file')
async def add_task_upload_file(file: UploadFile = File(...)):
    return dal.add_task_upload_file(file)


@router.get('/all-tasks/{user_name}')
def get_all_tasks(user_name):
    pass


@router.get('/{id}')
def get_task_using_id(id):
    pass


# @router.post('/add-new-task')
# async def add_newtask(
#     title: str = Form(...),
#     user_name: str = Form(...),
#     languages: str = Form("Python"),
#     description: str | None = Form(None),
#     groups: str = Form("public"),
#     price: int = Form(...),
# ):
#     return dal.add_new_task(title, user_name, languages, description, groups, price)