from fastapi import APIRouter

from app.controllers.rates import RatesController, codes

router = APIRouter(prefix="/rates")


@router.get("/available_currencies")
def get_available_currencies():
    return list(codes.keys())


@router.get("/currencies/{date}")
def get_currencies_for_date(date: str):
    return RatesController.get_currencies(date)


@router.get("/currency/{currency}/{from_date}/{to_date}")
def get_currency_for_period(currency: str, from_date: str, to_date: str):
    return RatesController.get_currency_for_period(currency, from_date, to_date)


@router.route('/available_metals')
def get_available_metals():
    return ['Au', 'Ag', 'Pt', 'Pd']


@router.get("/metals/{date}")
def get_metals_for_date(date: str):
    return RatesController.get_metals_for_date(date)


@router.get("/metal/{metal}/{from_date}/{to_date}")
def get_metals_for_date(metal: str, from_date: str, to_date: str):
    return RatesController.get_metal_for_period(metal, from_date, to_date)


@router.get("/stocks/")
def get_all_companies():
    return RatesController.get_all_companies()


@router.get("/stocks/{ticker}/{from_date}/{to_date}")
def get_prices_for_period(ticker: str, from_date: str, to_date: str):
    return RatesController.get_candles_for_period(ticker, from_date, to_date)
