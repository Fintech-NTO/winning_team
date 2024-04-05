import { colors } from "@mui/material";
import "./BaseLine.css";
import closeImg  from "./../../icons/close.png";
import { LineChart } from "@mui/x-charts";
import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import CONST from "../../CONST";
import { componentsContext } from "../pages/MainPage";



function MetalBaseLine(props) {
    let offsetX;
    let offsetY;
    let inFocus=false;

    const move=e=> {
        const el=e.target
        if (e.pageY-offsetY > 41 && inFocus) {
            el.style.left = `${e.pageX-offsetX}px`
            el.style.top = `${e.pageY-offsetY}px`
        }
    }
    const add=e=> {
        const el=e.target
        offsetX=e.clientX-el.getBoundingClientRect().left
        offsetY=e.clientY-el.getBoundingClientRect().top
        // el.addEventListener('mousemove',move)
        inFocus = true;
    }
    const remove=e=> {
        const el=e.target;
        // el.removeEventListener('mousemove',move);
        inFocus = false;
    }

    const [metal, setMetal] = useState("Au");
    const [metalList, setMetalList] = useState(["Au", "Ag", "Pt", "Pd"]);
    const [metalName, setMetalName] = useState("Серебро");
    const [metalChart, setMetalChart] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [xAxis, setXAxis] = useState([1, 2, 3, 4, 5, 6, 7]);
    let start = new Date();
    start.setDate(start.getDate() - 8);
    start = start.toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(start);
    let end = new Date();
    end.setDate(end.getDate())
    end = end.toISOString().split("T")[0];
    const [endDate, setEndDate] = useState(end);
    let metalNames = useRef({"Au": "Серебро", "Ag": "Золото", "Pt": "Платина", "Pd": "Палладий"});
    const { components, setComponents } = useContext(componentsContext);

    useEffect(() => {
        updateData(metal, startDate, endDate);
    }, [])

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
    

    function updateData(m, sd, ed) {
        axios.get(CONST.apiUrl + "/rates/metal/" + m + "/" + sd + "/" + ed).then((res)=>{
            let json = res.data;
            if (json.metals.length > 0) {
                setMetalName(metalNames.current[m]);
                let chart = [];
                let _xAxis = [];
                for (let i = 0; i < json.metals.length; i++) {
                    const el = json.metals[i];
                    chart.push(el.price.toFixed(2));
                    _xAxis.push(el.date);
                }
            setMetalChart(chart);
            setXAxis(_xAxis);
            } else {
                setMetalChart([]);
                setXAxis([]);
            }
        })
    }

    function changeMetal(e) {
        setMetal(e.target.value);
        // updateData(e.target.value, startDate, endDate);
    }

    function changeStartDate(e) {
        setStartDate(e.target.value);
    }

    function changeEndDate(e) {
        setEndDate(e.target.value);
    }

    return (
        <div class="baseline" onMouseMove={move} onMouseDown={add} onMouseUp={remove} onMouseLeave={remove} style={{left: props.left + "px", top: props.top + "px"}}>
            <img src={closeImg} alt="" class="close" onClick={removeComponent} />
            <hr />
            {metalName}
            <span class="inputs">
                <select class="name" onChange={changeMetal}>
                    {metalList && metalList.map(c => (
                        <option value={c}>{c}</option>
                    ))}
                </select>
                <input type="date" value={startDate}
                onChange={changeStartDate}/>
                <input type="date" value={endDate}
                onChange={changeEndDate} />
                <input type="button" value="Загрузить" onClick={() => {updateData(metal, startDate, endDate)}}/>
            </span>
            <LineChart
                series={[
                    {
                    data: metalChart,
                    color: "#4272DC",
                    stack: "total",
                    showMark: false
                    },
                ]}
                xAxis={[{ scaleType: 'point', data: xAxis }]}
                width={600}
                height={200}
                disableAxisListener={true}
            />
            <span class="inputs_bottom">
                <a  href={CONST.apiUrl + "/export/stock/" + metal + "/" + startDate + "/" + endDate + ".pdf"} target="_blank"><input type="button" value="Экспорт в PDF" /></a>
                <a href={CONST.apiUrl + "/export/stock/" + metal + "/" + startDate + "/" + endDate + ".csv"} target="_blank"><input type="button" value="Экспорт в CSV" /></a>
            </span>
        </div>
    );
}

export default MetalBaseLine;