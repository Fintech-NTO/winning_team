import "./Value.css";
import { ChartContainer, AreaPlot } from '@mui/x-charts';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import "./../../icons/close.png";



function Number(props) {
    let offsetX,offsetY;
    const move=e=>
    {
        const el=e.target
        console.log(e.pageY-offsetY);
        if (e.pageY-offsetY > 41) {
            el.style.left = `${e.pageX-offsetX}px`
            el.style.top = `${e.pageY-offsetY}px`
        }
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

    return (
        <div class="number" onMouseDown={add} onMouseUp={remove} onMouseLeave={remove} style={{left: props.left + "px", top: props.top + "px"}}> 
            <div class="name">{props.name}</div>
            <div class="value">{props.value} {props.currency}</div>
            <div width="200" height="200">
            <ChartContainer
                width={210}
                height={160}
                series={[
                    {
                    data: [1, 4, 2, 3, 4, 6, 7],
                    type: 'line',
                    area: true,
                    stack: 'total',
                    color: "#4272DC"
                    },
                ]}
                xAxis={[{ scaleType: 'point', data: [1, 2, 3, 4, 5, 6, 7] }]}
            >
            <AreaPlot />
            </ChartContainer>
            </div>
            <div className={((!props.isNegative && props.procent > 0) || (props.isNegative && props.procent < 0)) ? "green growth" : "red growth" }>{props.procent > 0 ? <>+</> : <></>}{props.procent}%</div>
            <div class="period">{props.period}</div>
        </div>
    )
}

export default Number;