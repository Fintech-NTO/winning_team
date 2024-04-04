from fastapi import APIRouter

from app.controllers.prediction import predict

router = APIRouter(prefix="/prediction")

available = ["SBER"]


@router.get("/available_for_predict")
def available_for_predict():
    return available


@router.get("/predict/{ticker}/{from_date}/{to_date}")
def predict_stock(ticker: str, from_date: str, to_date: str):
    try:
        return predict(ticker, from_date, to_date)
    except e:
        return "Value error!"
