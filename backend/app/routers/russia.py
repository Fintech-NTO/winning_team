from fastapi import APIRouter

from app.controllers.russia import RussiaController

router = APIRouter(prefix='/russia')


@router.get("/key-rate")
def get_key_rate():
    return RussiaController.get_current_key_rate()


@router.get("/key-rate/{from_date}/{to_date}")
def get_key_rates_for_period(from_date: str, to_date: str):
    return RussiaController.get_key_rates(from_date, to_date)
