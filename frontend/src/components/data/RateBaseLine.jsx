import { colors } from "@mui/material";
import "./BaseLine.css";
import closeImg  from "./../../icons/close.png";
import { LineChart } from "@mui/x-charts";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import CONST from "../../CONST";
import { componentsContext } from "../pages/MainPage";



function RateBaseLine(props) {
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

    const [keyChart, setKeyChart] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [xAxis, setXAxis] = useState([1, 2, 3, 4, 5, 6, 7]);
    const { components, setComponents } = useContext(componentsContext);

    let start = new Date();
    start.setDate(start.getDate() - 366);
    start = start.toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(start);
    let end = new Date();
    end.setDate(end.getDate())
    end = end.toISOString().split("T")[0];
    const [endDate, setEndDate] = useState(end);

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
        updateData(startDate, endDate);
    }, []);

    function updateData(sd, ed) {
        axios.get(CONST.apiUrl + "/russia/key-rate/" + sd + "/" + ed).then((res)=>{
            let json = res.data;
            let chart = [];
            let _xAxis = [];
            for (let i = 0; i < json.length; i++) {
                const el = json[i];
                el.key_rate = +el.key_rate.replace(",", ".");
                chart.push(el.key_rate.toFixed(2));
                _xAxis.push(el.month);
            }
            setKeyChart(chart);
            setXAxis(_xAxis);
        })
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
            Ставка ЦБ
            <span class="inputs">
                <input type="date" value={startDate}
                onChange={changeStartDate}/>
                <input type="date" value={endDate}
                onChange={changeEndDate} />
                <input type="button" value="Загрузить" onClick={() => {updateData(startDate, endDate)}}/>
            </span>
            <LineChart
                series={[
                    {
                    data: keyChart,
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
                {/* <a  href={CONST.apiUrl + "/export/currency/" + currency + "/" + startDate + "/" + endDate + ".pdf"} target="_blank"><input type="button" value="Экспорт в PDF" /></a>
                <a href={CONST.apiUrl + "/export/currency/" + currency + "/" + startDate + "/" + endDate + ".csv"} target="_blank"><input type="button" value="Экспорт в CSV" /></a> */}
            </span>
        </div>
    );
}

export default RateBaseLine;