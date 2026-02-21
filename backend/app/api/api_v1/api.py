from fastapi import APIRouter
from app.api.api_v1.endpoints import portfolio

api_router = APIRouter()
api_router.include_router(portfolio.router, prefix="/portfolio", tags=["portfolio"])
