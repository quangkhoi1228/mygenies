pm2 delete mygenies-python-lab-dev
pm2 start "gunicorn -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8002" --name mygenies-python-lab-dev
