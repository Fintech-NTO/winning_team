from datetime import datetime

from app.common.cb_format import cb_format


def export_filename(name: str, from_date: str, to_date: str):
    return f"{name}_{from_date}_{to_date}"


def export_title(name: str, from_date: str, to_date: str):
    return f"{name} {cb_format(from_date)} - {cb_format(to_date)}"
