from pydantic import BaseModel


class Currency(BaseModel):
    code: str
    count: int
    name: str
    price: float
