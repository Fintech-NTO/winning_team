import axios from "axios";
import CONST from "../CONST";


// eslint-disable-next-line import/no-anonymous-default-export
export default async () => {
    let result = [];
    await axios.get(CONST.apiUrl + "/rates/available_currencies").then((res)=>{
        
        result = res.data;
    })
    return result;
}