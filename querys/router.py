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


@router.get('/working-tasks/{reviwer_name}')
def get_tasks_the_user_is_currently_working_on(reviwer_name):
    return dal.working_on(reviwer_name)

@router.get('/finished-tasks/{reviwer_name}')
def get_tasks_the_user_has_finished(reviwer_name):
    return dal.finished(reviwer_name)


# @router.post('/add-task')
# def add_task(task: TaskCreate):
#     return dal.add_task_to_codes(task)



@router.get('/all-tasks/{user_name}')
def get_all_tasks(user_name):
    return dal.get_available_by_user(user_name)


@router.get('/{id}')
def get_task_using_id(id):
    return dal.get_full_task_by_id(id)


@router.post('/add-task-with-file')
async def add_task_with_file(
    title: str = Form(...),
    user_name: str = Form(...),
    languages: str = Form("Python"),
    description: str | None = Form(None),
    groups: str = Form("public"),
    price: int = Form(...),
    file: UploadFile = File(...)
):
    return dal.add_task_upload_file(title, user_name, languages, description, groups, price, file)


@router.post('/add-task')
async def add_task(
    title: str = Form(...),
    user_name: str = Form(...),
    languages: str = Form("Python"),
    description: str | None = Form(None),
    groups: str = Form("public"),
    price: int = Form(...),
    code: str = Form(...)
):
    return dal.add_task_manually(title, user_name, languages, description, groups, price, code)
    
