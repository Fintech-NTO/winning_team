import "./Value.css";
import { ChartContainer, AreaPlot } from '@mui/x-charts';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import closeImg from "./../../icons/close.png";
import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import CONST from "../../CONST";
import { componentsContext } from "../pages/MainPage";


function MetalValue(props) {
    // let offsetX;
    // let offsetY;
    // let inFocus=false;

    let offsetX = useRef();
    let offsetY = useRef();
    let inFocus = useRef(false);

    const move = e => {
        const el = e.target
        if (e.pageY - offsetY.current > 41 && inFocus.current) {
            el.style.left = `${e.pageX - offsetX.current}px`
            el.style.top = `${e.pageY - offsetY.current}px`
        }
    }
    const add = e => {
        const el = e.target
        offsetX.current = e.clientX - el.getBoundingClientRect().left
        offsetY.current = e.clientY - el.getBoundingClientRect().top
        inFocus.current = true;
    }
    const remove = e => {
        const el = e.target;
        inFocus.current = false;
    }

    const [metal, setMetal] = useState("Au");
    const [metalList, setMetalList] = useState(["Au", "Ag", "Pt", "Pd"]);
    const [metalName, setMetalName] = useState("Золото");
    const [metalValue, setMetalValue] = useState();
    const [metalChart, setMetalChart] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [xAxis, setXAxis] = useState([1, 2, 3, 4, 5, 6, 7]);
    const [metalProcent, setMetalProcent] = useState();
    const [sharePeriod, setSharePeriod] = useState("week");
    const [mp, setMp] = useState(["Au", "week"]);
    let metalNames = useRef({"Au": "Золото", "Ag": "Серебро", "Pt": "Платина", "Pd": "Палладий"});
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

    useEffect(() => {
        const id = setInterval(() => {
            setMp((_mp) => {
                updateData(_mp[0], _mp[1]);
                return _mp;
            })
        }, 1000)
        return () => {
            clearInterval(id)
        }
    }, [setMetal, setMetalList])


    function updateData(s, p) {
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
        axios.get(CONST.apiUrl + "/rates/metal/" + s + "/" + start + "/" + end).then((res) => {
            let json = res.data;
            if (json.metals.length > 0) {
                setMetalValue(json.metals[json.metals.length - 1].price.toFixed(2));
                setMetalName(metalNames.current[s]);
                setMetalProcent(((json.metals[json.metals.length - 1].price - json.metals[0].price) / json.metals[json.metals.length - 1].price * 100).toFixed(1))
                let chart = [];
                let min_v = 1000000;
                for (let i = 0; i < json.metals.length; i++) {
                    const el = json.metals[i].price;
                    if (min_v > el) {
                        min_v = el;
                    }
                    chart.push(el)
                }
                chart = chart.map((el) => { return (el - min_v) + 1 })
                setMetalChart(chart);
                let _xAxis = []
                for (let i = 1; i < chart.length + 1; i++) {
                    _xAxis.push(i);
                }
                setXAxis(_xAxis);
            } else {
                setMetalValue(0);
                setMetalProcent(0);
                setMetalChart([]);
                setXAxis([]);
            }
        })
    }

    function changeCurrency(e) {
        setMetal(e.target.value);
        setMp([e.target.value, sharePeriod]);
        // updateData(e.target.value, currencyPeriod);
    }

    function changePeriod(e) {
        setSharePeriod(e.target.value);
        setMp([metal, e.target.value]);
        // updateData(currency, e.target.value);
    }

    return (
        <div class="number" onMouseMove={move} onMouseDown={add} onMouseUp={remove} onMouseLeave={remove} style={{ left: props.left + "px", top: props.top + "px" }}>
            <img src={closeImg} alt="" class="close" onClick={removeComponent} />
            <hr />
            {metalName}
            {/* {props.uuid} */}  
            <select class="name" onChange={changeCurrency}>
                {metalList && metalList.map(s => (
                    <option value={s}>{s}</option>
                ))}
            </select>
            
            <div class="value">{metalValue} ₽</div>
            <div width="200" height="200">
                <ChartContainer
                    width={210}
                    height={160}
                    series={[
                        {
                            data: metalChart,
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
            <div className={metalProcent > 0 ? "green growth" : "red growth"}>{metalProcent > 0 ? <>+</> : <></>}{metalProcent} %</div>
            <select class="period" onChange={changePeriod}>
                <option value="week">За неделю</option>
                <option value="month">За Месяц</option>
                <option value="year">За год</option>
            </select>
        </div>
    )
}

export default MetalValue;