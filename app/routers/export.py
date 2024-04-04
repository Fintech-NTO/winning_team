from fastapi import APIRouter
from starlette.responses import FileResponse

from app.common.export import export_filename, export_title
from app.controllers.export import ExportController

router = APIRouter(prefix="/export")


@router.get("/currency/{currency}/{from_date}/{to_date}.csv", response_class=FileResponse)
def export_currency_csv(currency: str, from_date: str, to_date: str):
    filename = export_filename(currency, from_date, to_date)
    ExportController.create_csv_from_raw(
        filename,
        ExportController.get_raw_currency(currency, from_date, to_date)
    )
    return FileResponse(path=f"static/{filename}.csv")


@router.get("/currency/{currency}/{from_date}/{to_date}.pdf", response_class=FileResponse)
def export_currency_pdf(currency: str, from_date: str, to_date: str):
    filename = export_filename(currency, from_date, to_date)
    ExportController.create_pdf_from_raw(
        filename,
        export_title(currency, from_date, to_date),
        ExportController.get_raw_currency(currency, from_date, to_date)
    )
    return FileResponse(path=f"static/{filename}.pdf")


@router.get("/metal/{metal}/{from_date}/{to_date}.csv")
def export_metal_csv(metal: str, from_date: str, to_date: str):
    filename = export_filename(metal, from_date, to_date)
    ExportController.create_csv_from_raw(
        filename,
        ExportController.get_raw_metal(metal, from_date, to_date)
    )
    return FileResponse(path=f"static/{filename}.csv")


@router.get("/metal/{metal}/{from_date}/{to_date}.pdf")
def export_metal_pdf(metal: str, from_date: str, to_date: str):
    filename = export_filename(metal, from_date, to_date)
    ExportController.create_pdf_from_raw(
        filename,
        export_title(metal, from_date, to_date),
        ExportController.get_raw_metal(metal, from_date, to_date)
    )
    return FileResponse(path=f"static/{filename}.pdf")


@router.get("/stock/{ticker}/{from_date}/{to_date}.csv")
def export_stock_csv(ticker: str, from_date: str, to_date: str):
    filename = export_filename(ticker, from_date, to_date)
    ExportController.create_csv_from_raw(
        filename,
        ExportController.get_raw_stock(ticker, from_date, to_date)
    )
    return FileResponse(path=f"static/{filename}.csv")


@router.get("/stock/{ticker}/{from_date}/{to_date}.pdf")
def export_stock_pdf(ticker: str, from_date: str, to_date: str):
    filename = export_filename(ticker, from_date, to_date)
    ExportController.create_pdf_from_raw(
        filename,
        export_title(ticker, from_date, to_date),
        ExportController.get_raw_stock(ticker, from_date, to_date)
    )
    return FileResponse(path=f"static/{filename}.pdf")
