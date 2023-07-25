

from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.responses import HTMLResponse
from fastapi.routing import APIRoute
from fastapi.staticfiles import StaticFiles

import api
import shared.logger
from deps import get_ip
from shared import redis, settings, sqlx, w3
from shared.errors import Error, all_errors

index_path = settings.base_dir / 'static/dist/index.html'
INDEX_HTML = 'index.html not found :/'
if index_path.is_file():
    with open(index_path, 'r') as f:
        INDEX_HTML = f.read()

app = FastAPI(
    title='DigiSanad',
    version='0.0.1',
    description='**DigiSanad api documents**',
    dependencies=[get_ip()]
)


if settings.debug:
    app.mount('/media', StaticFiles(directory='media'), name='media')
    app.mount('/records', StaticFiles(directory='records'), name='records')
    app.mount('/static', StaticFiles(directory='static'), name='static')


@app.exception_handler(Error)
async def error_exception_handler(request, exc: Error):
    return exc.json()


@app.on_event('startup')
async def startup():
    # assert await w3.is_connected()
    await redis.ping()
    await sqlx.connect()


@app.on_event('shutdown')
async def shutdown():
    await redis.connection_pool.disconnect()
    await sqlx.disconnect()


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


for route in app.routes:
    if not isinstance(route, APIRoute):
        continue

    errors = []

    for d in route.dependencies:
        errors.extend(getattr(d, 'errors', []))

    oid = route.path.replace('/', '_').strip('_')
    oid += '_' + '_'.join(route.methods)
    route.operation_id = oid

    errors.extend((route.openapi_extra or {}).pop('errors', []))

    for e in errors:
        route.responses[e.code] = {
            'description': f'{e.title} - {e.status}',
            'content': {
                'application/json': {
                    'schema': {
                        '$ref': f'#/errors/{e.code}',
                    }
                }
            }
        }


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    schema['errors'] = {}

    for e in all_errors:
        schema['errors'][e.code] = e.schema

    app.openapi_schema = schema
    return app.openapi_schema


app.openapi = custom_openapi
