from fastapi import APIRouter

router = APIRouter(prefix="/export")


@router.get("/csv/currency/{currency}/{from_date}/{to_date}")
def export_currency_csv(currency: str, from_date: str, to_date: str):
    return


@router.get("/pdf/currency/{currency}/{from_date}/{to_date}")
def export_currency_pdf(currency: str, from_date: str, to_date: str):
    return


@router.get("/csv/metal/{metal}/{from_date}/{to_date}")
def export_metal_pdf(metal: str, from_date: str, to_date: str):
    return


@router.get("/pdf/metal/{metal}/{from_date}/{to_date}")
def export_metal_csv(metal: str, from_date: str, to_date: str):
    return


@router.get("/csv/stock/{ticker}/{from_date}/{to_date}")
def export_currency_csv(ticker: str, from_date: str, to_date: str):
    return


@router.get("/pdf/stock/{ticker}/{from_date}/{to_date}")
def export_currency_pdf(ticker: str, from_date: str, to_date: str):
    return
