import { colors } from "@mui/material";
import "./BaseLine.css";
import { LineChart } from "@mui/x-charts";


function BaseLine(props) {
    return (
        <div class="baseline">
            <div class="name">{props.name}</div>
            <LineChart
                series={[
                    {
                    data: [202, 243, 223, 278, 270, 256, 267],
                    color: "#4272DC",
                    stack: "total"
                    },
                ]}
                xAxis={[{ scaleType: 'point', data: ["01.01.2024", "02.01.2024", "03.01.2024", "04.01.2024", "05.01.2024", "06.01.2024", "07.01.2024"] }]}
                width={640}
                height={300}
                disableAxisListener={true}
            />
        </div>
    );
}

export default BaseLine;