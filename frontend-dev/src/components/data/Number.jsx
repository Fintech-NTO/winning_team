import "./Number.css";


function Number(props) {
    return (
        <div class="number">
            <div class="name">{props.name}</div>
            <div class="value">{props.value}</div>
            <div className={((!props.isNegative && props.procent > 0) || (props.isNegative && props.procent < 0)) ? "green growth" : "red growth" }>{props.procent > 0 ? <>+</> : <></>}{props.procent}%</div>
            <div class="period">{props.period}</div>
        </div>
    )
}

export default Number;