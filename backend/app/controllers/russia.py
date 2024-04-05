from datetime import date, timedelta

import requests
from bs4 import BeautifulSoup

from app.common.cb_format import cb_format


class RussiaController:
    @staticmethod
    def get_key_rates(from_date: str, to_date: str):
        page = requests.get(
            f"https://www.cbr.ru/hd_base/infl/?UniDbQuery.Posted=True&UniDbQuery.From={cb_format(from_date)}&UniDbQuery.To={cb_format(to_date)}")
        soup = BeautifulSoup(page.text, "html.parser")

        key_rates = []
        for tr in soup.find_all("tr"):
            td = tr.find_next('td')
            month, td = td.text, td.find_next('td')
            key_rate, td = td.text, td.find_next('td')
            inflation, td = td.text, td.find_next('td')
            key_rates.append({
                'month': month,
                'key_rate': key_rate,
                'inflation': inflation
            })
        return list(reversed(key_rates))

    @staticmethod
    def get_current_key_rate():
        res = RussiaController.get_key_rates((date.today() - timedelta(weeks=5)).isoformat(), date.today().isoformat())
        return {
            'key_rate': res[-1]['key_rate'],
            'inflation': res[-1]['inflation'],
        }

