from fastapi import APIRouter
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


@router.get('/all-tasks/{user_name}')
def get_all_tasks(user_name):
    pass


@router.get('/{id}')
def get_task_using_id(id):
    pass
