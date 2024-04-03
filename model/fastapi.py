from pydantic import BaseModel


class Currency(BaseModel):
    code: str
    count: int
    name: str
    price: float


class DatedCurrency(BaseModel):
    date: str
    count: int
    price: float


class CurrencyForPeriod(BaseModel):
    code: str
    name: str
    currencies: list[DatedCurrency]
