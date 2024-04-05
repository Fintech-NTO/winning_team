import csv

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Table, TableStyle

from app.common.mkdir_if_not_exists import mkdir_if_not_exists
from app.controllers.rates import RatesController


def split_table(canvas: Canvas, table: Table, flag: bool = True):
    width, height = A4
    table_pieces = table.split(width, height - 100 if flag else height - 50)
    if len(table_pieces) > 1:
        w, h = table_pieces[0].wrapOn(canvas, 0, 0)
        table_pieces[0].drawOn(canvas, 50, height - h - 50 if flag else height - h - 25)
        canvas.showPage()
        split_table(canvas, table_pieces[1], False)
    else:
        w, h = table_pieces[0].wrapOn(canvas, 0, 0)
        table_pieces[0].drawOn(canvas, 50, height - h - 50 if flag else height - h - 25)
        canvas.showPage()


class ExportController:
    @staticmethod
    def get_raw_stock(ticker: str, from_date: str, to_date: str):
        data = RatesController.get_candles_for_period(ticker, from_date, to_date)
        raw = [("Date", "Close", "Volume")]
        for row in data:
            raw.append((row.date, row.close, row.volume))
        return raw

    @staticmethod
    def get_raw_currency(currency: str, from_date: str, to_date: str):
        data = RatesController.get_currency_for_period(currency, from_date, to_date)
        raw = [("Date", "Count", "Price")]
        for row in data.currencies:
            raw.append((row.date, row.count, row.price))
        return raw

    @staticmethod
    def get_raw_metal(metal: str, from_date: str, to_date: str):
        data = RatesController.get_metal_for_period(metal, from_date, to_date)
        raw = [("Date", "Price")]
        for row in data.metals:
            raw.append((row.date, row.price))
        return raw

    @staticmethod
    def create_pdf_from_raw(filename: str, title: str, raw: list):
        mkdir_if_not_exists("static")
        pdf_file = Canvas(f"static/{filename}.pdf")

        pdf_file.setFont("Helvetica", 16)
        pdf_file.drawString(50, 815, title)

        table = Table(raw, colWidths=[4 * cm, 4 * cm, 4 * cm])
        table.setStyle(TableStyle([('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
                                   ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
                                   ]))
        split_table(pdf_file, table)

        pdf_file.save()

    @staticmethod
    def create_csv_from_raw(filename: str, raw: list):
        mkdir_if_not_exists("static")
        with open(f'static/{filename}.csv', 'w') as csvfile:
            csvwriter = csv.writer(csvfile, lineterminator="\n")
            for row in raw:
                csvwriter.writerow(row)


