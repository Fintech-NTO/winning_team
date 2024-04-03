import { colors } from "@mui/material";
import "./BaseLine.css";
import { LineChart } from "@mui/x-charts";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import CONST from "../../CONST";

function CurrencyBaseLine(props) {
    let offsetX,offsetY;
    const move=e=>
    {
        const el=e.target
        el.style.left = `${e.pageX-offsetX}px`
        el.style.top = `${e.pageY-offsetY}px`
    }
    const add=e=>
    {
        const el=e.target
        offsetX=e.clientX-el.getBoundingClientRect().left
        offsetY=e.clientY-el.getBoundingClientRect().top
        el.addEventListener('mousemove',move)
    }
    const remove=e=>{
        const el=e.target
        el.removeEventListener('mousemove',move)
    }

    const [currency, setCurrency] = useState();
    const [currencyList, setCurrencyList] = useState();
    const [currencyName, setCurrencyName] = useState();
    const [currencyChart, setCurrencyChart] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [xAxis, setXAxis] = useState([1, 2, 3, 4, 5, 6, 7]);
    let start = new Date();
    start.setDate(start.getDate() - 8);
    start = start.toISOString().split("T")[0];
    const [startDate, setStartDate] = useState();
    let end = new Date();
    end.setDate(end.getDate())
    end = end.toISOString().split("T")[0];
    const [endDate, setEndDate] = useState();
    
    useEffect(()=>{
        console.log(1);
        axios.get(CONST.apiUrl + "/rates/available_currencies").then((res)=>{
            setCurrencyList(res.data);
            setCurrency(res.data[0]);
            updateData(res.data[0], startDate, endDate);
        })
    }, [setCurrencyList]);

    function updateData(c, sd, ed) {
        axios.get(CONST.apiUrl + "/rates/currency/" + c + "/" + sd + "/" + ed).then((res)=>{
            let json = res.data;
            console.log(json);
            console.log(start, end);
            setCurrencyName(json.name);
            let chart = [];
            let _xAxis = [];
            for (let i = 0; i < json.currencies.length; i++) {
                const el = json.currencies[i];
                chart.push(el.price.toFixed(2));
                _xAxis.push(el.date);
            }
            setCurrencyChart(chart);
            setXAxis(_xAxis);
        })
    }

    function changeCurrency(e) {
        setCurrency(e.target.value);
        updateData(e.target.value, startDate, endDate);
    }

    function changeStartDate(e) {
        setStartDate(e.target.value);
    }

    function changeEndDate(e) {
        setEndDate(e.target.value);
    }


    return (
        <div class="baseline" onMouseDown={add} onMouseUp={remove} onMouseLeave={remove} style={{left: props.left + "px", top: props.top + "px"}}>
            <hr/>
            {currencyName}
            <span class="inputs">
                <select class="name" onChange={changeCurrency}>
                    {currencyList && currencyList.map(c => (
                        <option value={c}>{c}</option>
                    ))}
                </select>
                <input type="date" value={startDate}
                onChange={changeStartDate}/>
                <input type="date" value={endDate}
                onChange={changeEndDate} />
                <input type="button" value="Загрузить" onClick={() => {updateData(currency, startDate, endDate)}}/>
            </span>
            <LineChart
                series={[
                    {
                    data: currencyChart,
                    color: "#4272DC",
                    stack: "total",
                    showMark: false
                    },
                ]}
                xAxis={[{ scaleType: 'point', data: xAxis }]}
                width={640}
                height={225}
                disableAxisListener={true}
            />
        </div>
    );
}

export default CurrencyBaseLine;