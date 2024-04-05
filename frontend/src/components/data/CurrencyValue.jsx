import "./Value.css";
import { ChartContainer, AreaPlot } from '@mui/x-charts';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import closeImg  from "./../../icons/close.png";
import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import CONST from "../../CONST";
import { componentsContext } from "../pages/MainPage";


function CurrencyValue(props) {
    // let offsetX;
    // let offsetY;
    // let inFocus=false;

    let offsetX = useRef();
    let offsetY = useRef();
    let inFocus = useRef(false);

    const move=e=> {
        const el=e.target
        if (e.pageY-offsetY.current > 41 && inFocus.current) {
            el.style.left = `${e.pageX-offsetX.current}px`
            el.style.top = `${e.pageY-offsetY.current}px`
        }
    }
    const add=e=> {
        const el=e.target
        offsetX.current=e.clientX-el.getBoundingClientRect().left
        offsetY.current=e.clientY-el.getBoundingClientRect().top
        inFocus.current = true;
    }
    const remove=e=> {
        const el=e.target;
        inFocus.current = false;
    }

    const [currency, setCurrency] = useState();
    const [currencyList, setCurrencyList] = useState();
    const [currencyName, setCurrencyName] = useState();
    const [currencyValue, setCurrencyValue] = useState();
    const [currencyChart, setCurrencyChart] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [xAxis, setXAxis] = useState([1, 2, 3, 4, 5, 6, 7]);
    const [currencyProcent, setCurrencyProcent] = useState();
    const [currencyPeriod, setCurrencyPeriod] = useState("week");
    const [cp, setCp] = useState(["AUD", "week"]);
    const { components, setComponents } = useContext(componentsContext);

    function removeComponent() {
        let _components = [];
        for (let i = 0; i < components.length; i++) {
            const component = components[i];
            if (component) {
                if (component.props.uuid != props.uuid) {
                    _components.push(component);
                } else {
                    _components.push(undefined);
                }
            } else {
                _components.push(undefined);
            }
            
        }
        setComponents(_components);
    }

    useEffect(()=>{
        axios.get(CONST.apiUrl + "/rates/available_currencies").then((res)=>{
            setCurrencyList(res.data);
            setCurrency(res.data[0]);
            updateData(res.data[0], currencyPeriod);
        })
        const id = setInterval(() => {
            // let _currency;
            // setCurrency((currency) => {
            //     _currency = currency;
            //     return currency
            //   })
            // let _currencyPeriod;
            //   setCurrencyPeriod((currencyPeriod) => {
            //     _currencyPeriod = currencyPeriod;
            //       return currencyPeriod
            //     })
            // console.log(_currency, _currencyPeriod);
            // if (_currency && _currencyPeriod) {
            //     updateData(_currency, _currencyPeriod);
            // }
            setCp((_cp) => {
                updateData(_cp[0], _cp[1]);
                return _cp;
              })
          }, 1000)
          return () => {
            clearInterval(id)
          }
    }, [setCurrency, setCurrencyList])


    function updateData(c, p) {
        let end = new Date();
        end.setDate(end.getDate());
        end = end.toISOString().split("T")[0];
        let start = new Date();
        if (p == "week") {
            start.setDate(start.getDate() - 8);
            start = start.toISOString().split("T")[0];
        } else if (p == "month") {
            start.setDate(start.getDate() - 31);
            start = start.toISOString().split("T")[0];
        } else {
            start.setDate(start.getDate() - 366);
            start = start.toISOString().split("T")[0];
        }
        axios.get(CONST.apiUrl + "/rates/currency/" + c + "/" + start + "/" + end).then((res)=>{
            let json = res.data;
            setCurrencyName(json.name);
            setCurrencyValue(json.currencies[json.currencies.length - 1].price.toFixed(2));
            setCurrencyProcent(((json.currencies[json.currencies.length - 1].price - json.currencies[0].price) / json.currencies[json.currencies.length - 1].price * 100).toFixed(1))
            let chart = [];
            let min_v = 1000000;
            for (let i = 0; i < json.currencies.length; i++) {
                const el = json.currencies[i].price;
                if (min_v > el) {
                    min_v = el;
                }
                chart.push(el)
            }
            chart = chart.map((el) => {return (el - min_v) + 1})
            setCurrencyChart(chart);
            let _xAxis = []
            for (let i = 1; i < chart.length + 1; i++) {
                _xAxis.push(i);
            }
            setXAxis(_xAxis);
        })
    }

    function changeCurrency(e) {
        setCurrency(e.target.value);
        setCp([e.target.value, currencyPeriod]);
        // updateData(e.target.value, currencyPeriod);
    }

    function changePeriod(e) {
        setCurrencyPeriod(e.target.value);
        setCp([currency, e.target.value]);
        // updateData(currency, e.target.value);
    }

    return (
        <div class="number" onMouseMove={move} onMouseDown={add} onMouseUp={remove} onMouseLeave={remove} style={{left: props.left + "px", top: props.top + "px"}}> 
            <img src={closeImg} alt="" class="close" onClick={removeComponent} />
            <hr />
            {currencyName}
            {/* {props.uuid} */}
            <select class="name" onChange={changeCurrency}>
            {currencyList && currencyList.map(c => (
                <option value={c}>{c}</option>
            ))}
            </select>
            <div class="value">{currencyValue} ₽</div>
            <div width="200" height="200">
                <ChartContainer
                    width={210}
                    height={160}
                    series={[
                        {
                            data: currencyChart,
                            type: 'line',
                            area: true,
                            stack: 'total',
                            color: "#4272DC"
                        },
                    ]}
                    xAxis={[{ scaleType: 'point', data: xAxis }]}
                >
                <AreaPlot />
                </ChartContainer>
            </div>
            <div className={currencyProcent > 0 ? "green growth" : "red growth" }>{currencyProcent > 0 ? <>+</> : <></>}{currencyProcent} %</div>
            <select class="period" onChange={changePeriod}>
                <option value="week">За неделю</option>
                <option value="month">За Месяц</option>
                <option value="year">За год</option>
            </select>
        </div>
    )
}

export default CurrencyValue;