import "./Value.css";
import { ChartContainer, AreaPlot } from '@mui/x-charts';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import closeImg from "./../../icons/close.png";
import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import CONST from "../../CONST";
import { componentsContext } from "../pages/MainPage";


function RateValue(props) {
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

    const [keyValue, setKeyValue] = useState();
    const [keyChart, setKeyChart] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [xAxis, setXAxis] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const [keyProcent, setKeyProcent] = useState();
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
            updateData();
        }, 1000)
    }, [])


    function updateData() {
        let end = new Date();
        end.setDate(end.getDate());
        end = end.toISOString().split("T")[0];
        let start = new Date();
        start.setDate(start.getDate() - 366);
        start = start.toISOString().split("T")[0];

        axios.get(CONST.apiUrl + "/russia/key-rate/" + start + "/" + end).then((res) => {
            let json = res.data;
            if (json.length > 0) {
                let min_v = 1000000;
                let chart = [];
                for (let i = 0; i < json.length; i++) {
                    let el = json[i].key_rate;
                    el = el.replace(",", ".");
                    el = +el;
                    if (min_v > el) {
                        min_v = el;
                    }
                    chart.push(el)
                }
                setKeyValue(chart[0]);
                setKeyProcent(((chart[chart.length - 1] - chart[0]) / chart[chart.length - 1] * 100).toFixed(2));
                chart = chart.map((el) => { return (el - min_v) + 1 });
                setKeyChart(chart);
                let _xAxis = [];
                for (let i = 1; i < chart.length + 1; i++) {
                    _xAxis.push(i);
                }
                setXAxis(_xAxis);
            } else {
                setKeyValue(0);
                setKeyProcent(0);
                setKeyChart([]);
                setXAxis([]);
            }
        })
    }


    return (
        <div class="number" onMouseMove={move} onMouseDown={add} onMouseUp={remove} onMouseLeave={remove} style={{ left: props.left + "px", top: props.top + "px" }}>
            <img src={closeImg} alt="" class="close" onClick={removeComponent} />
            <hr />
            Ставка ЦБ
            
            <div class="value">{keyValue} %</div>
            <div width="200" height="200">
                <ChartContainer
                    width={210}
                    height={160}
                    series={[
                        {
                            data: keyChart,
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
            <div className={keyProcent < 0 ? "green growth" : "red growth"}>{keyProcent > 0 ? <>+</> : <></>}{keyProcent} %</div>
            <div class="period">За год</div>
        </div>
    )
}

export default RateValue;