import "./Number.css";
import { ChartContainer, AreaPlot } from '@mui/x-charts';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';


function Number(props) {
    return (
        <div class="number">
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