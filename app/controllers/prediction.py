import pickle

import pandas as pd


def predict(pickle_file: str, from_date: str, to_date: str):
    with open(f'app/pickles/{pickle_file}.pickle', 'rb') as f:
        results = pickle.load(f)
        st_pred = results.get_prediction(start=pd.to_datetime(from_date),
                                         end=pd.to_datetime(to_date),
                                         dynamic=False)
        prediction = []
        for key in st_pred.predicted_mean.keys():
            prediction.append({
                "date": str(key).split(" ")[0],
                "price": round(st_pred.predicted_mean[key], 4)
            })
        return prediction
