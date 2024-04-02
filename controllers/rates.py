import requests
from bs4 import BeautifulSoup

from common.cb_format import cb_format
from model.fastapi import Currency


class RatesController:
    @staticmethod
    def get_currencies(iso: str):
        page = requests.get(
            f"https://www.cbr.ru/currency_base/daily/?UniDbQuery.Posted=True&UniDbQuery.To={cb_format(iso)}")
        soup = BeautifulSoup(page.text, "html.parser")

        currencies = []
        for tr in soup.find_all("tr"):
            td = tr.find_next('td')
            _, td = td.text, td.find_next('td')
            code, td = td.text, td.find_next('td')
            count, td = td.text, td.find_next('td')
            name, td = td.text, td.find_next('td')
            price = td.text
            currencies.append(Currency(code=code, count=int(count), name=name, price=float(price.replace(',', '.'))))
        return currencies
