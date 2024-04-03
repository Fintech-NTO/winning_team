from fastapi import APIRouter

from controllers.rates import RatesController

router = APIRouter(prefix="/rates")


@router.get("/currency_for_date/{date}")
def get_currency_for_date_in_iso_format(date: str):
    return RatesController.get_currencies(date)


@router.get("/currency_for_date/{currency}/{from_date}/{to_date}")
def get_currency_for_date_in_iso_format(currency: str, from_date: str, to_date: str):
    return RatesController.get_currency_for_period(currency, from_date, to_date)
