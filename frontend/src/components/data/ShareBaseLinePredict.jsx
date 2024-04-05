import { colors } from "@mui/material";
import "./BaseLine.css";
import closeImg  from "./../../icons/close.png";
import { LinePlot, MarkPlot, LineChart } from '@mui/x-charts/LineChart';
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import CONST from "../../CONST";
import { componentsContext } from "../pages/MainPage";
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsReferenceLine } from '@mui/x-charts';


function ShareBaseLinePredict(props) {
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

    const [share, setShare] = useState();
    const [shareList, setShareList] = useState();
    const [shareName, setShareName] = useState();
    const [shareChart, setShareChart] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [xAxis, setXAxis] = useState([1, 2, 3, 4, 5, 6, 7]);
    const { components, setComponents } = useContext(componentsContext);
    const [daysCount, setDaysCount] = useState(7);
    

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
        axios.get(CONST.apiUrl + "/prediction/available_for_predict").then((res) => {
            setShareList(res.data);
            setShare(res.data[0]);
            console.log(daysCount);
            updateData();
        })
    }, [setShareList]);
    console.log()
    function updateData() {
        let today = new Date();
        let end = new Date();
        console.log(end.toISOString());
        end = end.toISOString().split("T")[0];
        let start = new Date();
        for (let i = 0; i < daysCount; i++) {
            start.setDate(start.getDate()-1);
        }
        start = start.toISOString().split("T")[0];
        axios.get(CONST.apiUrl + "/rates/stocks/" + share +  "/" + start + "/" + end).then((res)=>{
            let json = res.data;
            let _xAxis = [];
            if (json.length > 0) {
                let _chart = [];
                for (let i = 0; i < json.length; i++) {
                    const el = json[i];
                    _chart.push(el.close.toFixed(2));
                    _xAxis.push(el.date);
                }
                let start = new Date();
                start.setDate(start.getDate() + 1);
                start = start.toISOString().split("T")[0];
                let end = new Date();
                for (let i = 0; i < daysCount; i++) {
                    console.log(1);
                    end.setDate(end.getDate() + 1)
                }
                end = end.toISOString().split("T")[0];
                axios.get(CONST.apiUrl + "/prediction/predict/" + share + "/" + start + "/" + end).then((res) => {
                    let json = res.data;
                    for (let i = 0; i < json.length; i++) {
                        const el = json[i];
                        _chart.push(el.price.toFixed(2))
                        _xAxis.push(el.date);
                    }
                    console.log(xAxis);
                    setXAxis(_xAxis);
                    setShareChart(_chart);
                })
            }
        })
    }


    function changeCurrency(e) {
        setShare(e.target.value);
    }

    function changeStartDate(e) {
        setDaysCount(e.target.value);
    }

    return (
        <div class="baseline" onMouseMove={move} onMouseDown={add} onMouseUp={remove} onMouseLeave={remove} style={{left: props.left + "px", top: props.top + "px"}}>
            <img src={closeImg} alt="" class="close" onClick={removeComponent} />
            <hr />
            <span class="inputs">
                <select class="name" onChange={changeCurrency}>
                    {shareList && shareList.map(c => (
                        <option value={c}>{c}</option>
                    ))}
                </select>
                <input type="number" onChange={(e) => {setDaysCount(e.target.value)}}/>
                <input type="button" value="Загрузить" onClick={() => {updateData()}}/>
            </span>
            <div class="predictUnderLine">
                <hr />
                <small>Предсказание</small>
            </div>
            <LineChart
                series={[
                    {
                        data: shareChart,
                        color: "#4272DC",
                        stack: "total",
                        showMark: false
                    }
                ]}
                xAxis={[{ scaleType: 'point', data: xAxis }]}
                
                width={600}
                height={200}
                disableAxisListener={true}
            />
        </div>
    );
}

export default ShareBaseLinePredict;