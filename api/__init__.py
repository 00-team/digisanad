from fastapi import APIRouter

from .modules import auth, user

router = APIRouter(
    prefix='/api',
)


router.include_router(auth.router)
router.include_router(user.router)
