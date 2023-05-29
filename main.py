
from os import environ

import uvicorn
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.routing import APIRoute
from fastapi.staticfiles import StaticFiles

import api
from db import database, redis
from shared import settings

with open(settings.base_dir / 'static/index.html', 'r') as f:
    INDEX_HTML = f.read()

app = FastAPI(
    title='DigiSanad',
    version='0.0.1',
    description='**DigiSanad api documents**',
)


if environ.get('DEVELOPMENT'):
    app.mount('/media', StaticFiles(directory='media'), name='media')
    app.mount('/static', StaticFiles(directory='static'), name='static')


@app.on_event('startup')
async def startup():
    await redis.ping()
    await database.connect()


@app.on_event('shutdown')
async def shutdown():
    await redis.connection_pool.disconnect()
    await database.disconnect()


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


async def index():
    return HTMLResponse(INDEX_HTML)

for p in ['/', '/register/', '/login/', '/me/', '/dashboard/']:
    app.add_api_route(p, index, include_in_schema=False)

app.include_router(api.router)

for route in app.routes:
    if isinstance(route, APIRoute):
        route.operation_id = route.name


if __name__ == '__main__':
    uvicorn.run('main:app', port=7000, reload=True)
