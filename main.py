
import uvicorn
from fastapi import APIRouter, FastAPI
from fastapi.responses import HTMLResponse
from fastapi.routing import APIRoute
from fastapi.staticfiles import StaticFiles

from database import database
from modules import auth, user

app = FastAPI(
    title='DigiSanad',
    version='0.0.1',
    description='**DigiSanad api documents**',
)

app.mount('/media', StaticFiles(directory='media'), name='media')

api = APIRouter(
    prefix='/api',
)


@app.on_event('startup')
async def startup():
    # await redis.ping()
    await database.connect()


@app.on_event('shutdown')
async def shutdown():
    # await redis.connection_pool.disconnect()
    await database.disconnect()


api.include_router(auth.router)
api.include_router(user.router)

app.include_router(api)


@app.get('/rapidoc/', include_in_schema=False)
async def rapidoc():
    return HTMLResponse('''<!doctype html>
    <html><head><meta charset="utf-8">
    <script type="module" src="/static/rapidoc.js"></script></head><body>
    <rapi-doc spec-url="/openapi.json" persist-auth="true"
    bg-color="#040404" text-color="#f2f2f2" header-color="#040404"
    primary-color="#ff8800" nav-text-color="#eee" font-size="largest"
    allow-spec-url-load="false" allow-spec-file-load="false"
    show-method-in-nav-bar="as-colored-block" response-area-height="500px"
    show-header="false" /></body> </html>''')

for route in app.routes:
    if isinstance(route, APIRoute):
        route.operation_id = route.name


if __name__ == '__main__':
    uvicorn.run('main:app', port=7000, reload=True)
