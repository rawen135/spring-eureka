import asyncio
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from py_eureka_client import eureka_client

from version import SERVICE_NAME, SERVICE_VERSION


PORT = int(os.getenv('PORT', '8084'))
EUREKA_SERVER = os.getenv('EUREKA_SERVER', 'http://localhost:8761/eureka')
BASE_URL = f'http://localhost:{PORT}'

@asynccontextmanager
async def lifespan(_app):
    # init() is synchronous; run it in a worker thread because Uvicorn already
    # owns an asyncio event loop while the FastAPI lifespan is active.
    await asyncio.to_thread(
        eureka_client.init,
        eureka_server=EUREKA_SERVER,
        app_name='NOTIFICATION',
        instance_host='localhost',
        instance_ip='127.0.0.1',
        instance_port=PORT,
        status_page_url=f'{BASE_URL}/info',
        health_check_url=f'{BASE_URL}/health',
        home_page_url=f'{BASE_URL}/',
    )
    try:
        yield
    finally:
        await asyncio.to_thread(eureka_client.stop)


app = FastAPI(title=SERVICE_NAME, version=SERVICE_VERSION, lifespan=lifespan)


@app.get('/health')
async def health():
    return {'status': 'UP'}


@app.get('/info')
async def info():
    return {'name': SERVICE_NAME, 'version': SERVICE_VERSION}


@app.get('/')
async def home():
    return {
        'service': 'NOTIFICATION',
        'health': f'{BASE_URL}/health',
        'info': f'{BASE_URL}/info',
    }


