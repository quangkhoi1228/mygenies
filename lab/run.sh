pm2 delete mygenies-python-lab
pm2 start "gunicorn -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8001" --name mygenies-python-lab
