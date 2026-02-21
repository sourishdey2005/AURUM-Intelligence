from celery import Celery
from app.core.config import settings

if settings.REDIS_URL:
    celery_app = Celery("worker", broker=settings.REDIS_URL, backend=settings.REDIS_URL)

    celery_app.conf.task_routes = {
        "app.services.data_ingestion.*": "main-queue",
    }

    celery_app.autodiscover_tasks(["app.services"])
else:
    celery_app = None
