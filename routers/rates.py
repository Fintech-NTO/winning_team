from fastapi import APIRouter

from controllers.rates import RatesController

router = APIRouter(prefix="/rates")


@router.get("/currency_for_date/{date}")
def get_currency_for_date_in_iso_format(date: str):
    return RatesController.get_currencies(date)
