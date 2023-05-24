
import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
wsgi_app = 'main:app'
proc_name = 'digisanad gun'
worker_class = 'uvicorn.workers.UvicornWorker'
venv = '/digisanad/.env/bin/activate'
bind = 'unix:/usr/share/nginx/sockets/digisanad.sock'
