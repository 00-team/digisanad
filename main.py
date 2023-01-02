
from fastapi import FastAPI
from fastapi.routing import APIRoute

# TODO: make the doc
app = FastAPI(
    # title='DigiSanad',
    # version='0.0.1',
    # description='**DigiSanad api documents**',

    openapi_url=None
)


@app.on_event('startup')
async def startup():
    pass
    # plutus.connect()
    # plutus.stop()

    # await redis.ping()
    # await database.connect()


@app.on_event('shutdown')
async def shutdown():
    pass
    # plutus.disconnect()

    # await redis.connection_pool.disconnect()
    # await database.disconnect()


@app.get('/')
async def home():
    return {'page': 'home'}

# app.include_router(auth.router)
# app.include_router(user.router)
# app.include_router(info.router)
# app.include_router(admin.router)
# app.include_router(admin.user_router)


for route in app.routes:
    if isinstance(route, APIRoute):
        route.operation_id = route.name
