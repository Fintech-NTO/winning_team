from datetime import date

import requests
from bs4 import BeautifulSoup

from common.cb_format import cb_format, iso_from_cb
from model.fastapi import Currency, DatedCurrency, CurrencyForPeriod, Metal, DatedMetal, MetalForPeriod

codes = {'AUD': 'R01010', 'AZN': 'R01020A', 'AMD': 'R01060', 'BYN': 'R01090B', 'BGN': 'R01100', 'BRL': 'R01115',
         'HUF': 'R01135', 'VND': 'R01150', 'HKD': 'R01200', 'GEL': 'R01210', 'DKK': 'R01215', 'AED': 'R01230',
         'USD': 'R01235', 'EUR': 'R01239', 'EGP': 'R01240', 'INR': 'R01270', 'IDR': 'R01280', 'KZT': 'R01335',
         'CAD': 'R01350', 'QAR': 'R01355', 'KGS': 'R01370', 'CNY': 'R01375', 'MDL': 'R01500', 'NZD': 'R01530',
         'NOK': 'R01535', 'PLN': 'R01565', 'RON': 'R01585F', 'XDR': 'R01589', 'SGD': 'R01625', 'TJS': 'R01670',
         'THB': 'R01675', 'TRY': 'R01700J', 'UZS': 'R01717', 'UAH': 'R01720', 'CZK': 'R01760', 'SEK': 'R01770',
         'CHF': 'R01775', 'ZAR': 'R01810', 'JPY': 'R01820', "GBP": "R01035"}


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
            currencies.append(Currency(code=code, count=int(count), name=name,
                                       price=float(price.replace(',', '.'))))
        return currencies

    @staticmethod
    def get_currency_for_period(currency: str, from_iso: str, to_iso: str):
        currencies = []
        page = requests.get(
            f"https://www.cbr.ru/currency_base/dynamics/?UniDbQuery.Posted=True&UniDbQuery.so=1&UniDbQuery.mode=1&UniDbQuery.date_req1=&UniDbQuery.date_req2=&UniDbQuery.VAL_NM_RQ={codes[currency]}&UniDbQuery.From={cb_format(from_iso)}&UniDbQuery.To={cb_format(to_iso)}")
        soup = BeautifulSoup(page.text, "html.parser")

        for tr in soup.find_all("tr")[2:]:
            td = tr.find_next('td')
            cb_date, td = td.text, td.find_next('td')
            count, td = td.text, td.find_next('td')
            price = td.text
            currencies.append(
                DatedCurrency(date=iso_from_cb(cb_date), count=count, price=float(price.replace(',', '.'))))
        name = ""
        for c in RatesController.get_currencies(date.today().isoformat()):
            if c.code == currency:
                name = c.name
        return CurrencyForPeriod(code=currency, name=name, currencies=reversed(currencies))

    @staticmethod
    def get_metals_for_date(iso: str):
        page = requests.get(
            f"https://www.cbr.ru/hd_base/metall/metall_base_new/?UniDbQuery.Posted=True&UniDbQuery.From={cb_format(iso)}&UniDbQuery.To={cb_format(iso)}&UniDbQuery.Gold=true&UniDbQuery.Silver=true&UniDbQuery.Platinum=true&UniDbQuery.Palladium=true&UniDbQuery.so=1")
        soup = BeautifulSoup(page.text, "html.parser")
        metals = []
        for tr in soup.find_all("tr")[1:]:
            td = tr.find_next('td')
            _, td = td.text.replace(" ", ""), td.find_next('td')
            gold, td = td.text.replace(" ", ""), td.find_next('td')
            silver, td = td.text.replace(" ", ""), td.find_next('td')
            platinum, td = td.text.replace(" ", ""), td.find_next('td')
            palladium = td.text.replace(" ", "")
            metals.append(Metal(code='Au', name='Золото', price=float(gold.replace(",", "."))))
            metals.append(Metal(code='Ag', name='Золото', price=float(silver.replace(",", "."))))
            metals.append(Metal(code='Pt', name='Платина', price=float(platinum.replace(",", "."))))
            metals.append(Metal(code='Pd', name='Палладий', price=float(palladium.replace(",", "."))))
        return metals

    @staticmethod
    def get_metal_for_period(metal: str, from_iso: str, to_iso: str):
        page = requests.get(
            f"https://www.cbr.ru/hd_base/metall/metall_base_new/?UniDbQuery.Posted=True&UniDbQuery.From={cb_format(from_iso)}&UniDbQuery.To={cb_format(to_iso)}&UniDbQuery.Gold=true&UniDbQuery.Silver=true&UniDbQuery.Platinum=true&UniDbQuery.Palladium=true&UniDbQuery.so=1")
        soup = BeautifulSoup(page.text, "html.parser")
        metals = []
        for tr in soup.find_all("tr")[1:]:
            td = tr.find_next('td')
            _, td = td.text.replace(" ", ""), td.find_next('td')
            gold, td = td.text.replace(" ", ""), td.find_next('td')
            silver, td = td.text.replace(" ", ""), td.find_next('td')
            platinum, td = td.text.replace(" ", ""), td.find_next('td')
            palladium = td.text.replace(" ", "")
            if metal == 'Au':
                metals.append(DatedMetal(date=iso_from_cb(_), price=float(gold.replace(",", "."))))
            elif metal == 'Ag':
                metals.append(DatedMetal(date=iso_from_cb(_), price=float(silver.replace(",", "."))))
            elif metal == 'Pt':
                metals.append(DatedMetal(date=iso_from_cb(_), price=float(platinum.replace(",", "."))))
            elif metal == 'Pd':
                metals.append(DatedMetal(date=iso_from_cb(_), price=float(palladium.replace(",", "."))))
        return MetalForPeriod(code=metal,
                              name={'Au': 'Золото', 'Ag': 'Серебро', 'Pt': 'Платина', 'Pd': 'Палладий'}[metal],
                              metals=reversed(metals))
