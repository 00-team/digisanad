

from fastapi import APIRouter, Request
from sqlalchemy import select

from db.models import CompanyModel, CompanyTable
from deps import user_required
from shared import settings, sqlx

router = APIRouter(
    prefix='/companies',
    tags=['companies'],
    dependencies=[user_required()]
)


@router.get('/search/', response_model=list[CompanyModel])
async def search(request: Request, query: str, page: int = 0):
    # user: UserModel = request.state.user

    rows = await sqlx.fetch_all(
        select(CompanyTable)
        .where(CompanyTable.name.like(f'%{query}%'))
        .order_by(CompanyTable.company_id.desc())
        .limit(settings.page_size)
        .offset(page * settings.page_size)
    )

    return [CompanyModel(**r) for r in rows]
