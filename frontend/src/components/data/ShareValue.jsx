import "./Value.css";
import { ChartContainer, AreaPlot } from '@mui/x-charts';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import closeImg from "./../../icons/close.png";
import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import CONST from "../../CONST";
import { componentsContext } from "../pages/MainPage";


function ShareValue(props) {
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

    const [share, setShare] = useState();
    const [shareList, setShareList] = useState();
    const [shareName, setShareName] = useState();
    const [shareValue, setShareValue] = useState();
    const [shareChart, setShareChart] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [xAxis, setXAxis] = useState([1, 2, 3, 4, 5, 6, 7]);
    const [shareProcent, setShareProcent] = useState();
    const [sharePeriod, setSharePeriod] = useState("week");
    const [sp, setSp] = useState(["ABIO", "week"]);
    let companiesNames = useRef();
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
        axios.get(CONST.apiUrl + "/rates/stocks/").then((res) => {
            let _companiesNames = {};
            let _shareList = [];
            for (let i = 0; i < res.data.length; i++) {
                const element = res.data[i];
                _shareList.push(element.ticker);
                _companiesNames[element.ticker] = element.name;
            }
            setShareList(_shareList);
            setShare(_shareList[0]);
            companiesNames.current = _companiesNames;
            updateData(_shareList[0], sharePeriod);
        })
        const id = setInterval(() => {
            setSp((_sp) => {
                updateData(_sp[0], _sp[1]);
                return _sp;
            })
        }, 1000)
        return () => {
            clearInterval(id)
        }
    }, [setShare, setShareList])


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
        axios.get(CONST.apiUrl + "/rates/stocks/" + s + "/" + start + "/" + end).then((res) => {
            let json = res.data;
            if (json.length > 0) {
                setShareValue(json[json.length - 1].close.toFixed(2));
                setShareName(companiesNames.current[s]);
                setShareProcent(((json[json.length - 1].close - json[0].close) / json[json.length - 1].close * 100).toFixed(1))
                let chart = [];
                let min_v = 1000000;
                for (let i = 0; i < json.length; i++) {
                    const el = json[i].close;
                    if (min_v > el) {
                        min_v = el;
                    }
                    chart.push(el)
                }
                chart = chart.map((el) => { return (el - min_v) + 1 })
                setShareChart(chart);
                let _xAxis = []
                for (let i = 1; i < chart.length + 1; i++) {
                    _xAxis.push(i);
                }
                setXAxis(_xAxis);
            } else {
                setShareValue(0);
                setShareProcent(0);
                setShareChart([]);
                setXAxis([]);
            }
        })
    }

    function changeCurrency(e) {
        setShare(e.target.value);
        setSp([e.target.value, sharePeriod]);
        // updateData(e.target.value, currencyPeriod);
    }

    function changePeriod(e) {
        setSharePeriod(e.target.value);
        setSp([share, e.target.value]);
        // updateData(currency, e.target.value);
    }

    return (
        <div class="number" onMouseMove={move} onMouseDown={add} onMouseUp={remove} onMouseLeave={remove} style={{ left: props.left + "px", top: props.top + "px" }}>
            <img src={closeImg} alt="" class="close" onClick={removeComponent} />
            <hr />
            {shareName}
            {/* {props.uuid} */}  
            <select class="name" onChange={changeCurrency}>
                {shareList && shareList.map(s => (
                    <option value={s}>{s}</option>
                ))}
            </select>
            
            <div class="value">{shareValue} ₽</div>
            <div width="200" height="200">
                <ChartContainer
                    width={210}
                    height={160}
                    series={[
                        {
                            data: shareChart,
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
            <div className={shareProcent > 0 ? "green growth" : "red growth"}>{shareProcent > 0 ? <>+</> : <></>}{shareProcent} %</div>
            <select class="period" onChange={changePeriod}>
                <option value="week">За неделю</option>
                <option value="month">За Месяц</option>
                <option value="year">За год</option>
            </select>
        </div>
    )
}

export default ShareValue;