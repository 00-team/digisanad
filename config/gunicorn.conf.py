
import multiprocessing

chdir = '/digisanad/'
# workers = multiprocessing.cpu_count() * 2 + 1
threads = multiprocessing.cpu_count() * 2 + 1
wsgi_app = 'main:app'
proc_name = 'digisanad gun'
worker_class = 'uvicorn.workers.UvicornWorker'
venv = '/digisanad/.env/bin/activate'
bind = 'unix:///usr/share/nginx/sockets/digisanad.sock'
loglevel = 'info'
accesslog = '/var/log/digisanad/access.log'
acceslogformat = '%(h)s %(l)s %(u)s %(t)s %(r)s %(s)s %(b)s %(f)s %(a)s'
errorlog = '/var/log/digisanad/error.log'
