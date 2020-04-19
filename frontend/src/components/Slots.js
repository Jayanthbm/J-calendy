import React from 'react';
import { Link } from "react-router-dom";
const Slots = props => {

    function time(time) {
        if (time < 12) {
            return `${time} AM`
        }
        if (time == 12) {
            return `${time} PM`
        }
        if (time > 12) {
            return `${time - 12} PM`
        }
    }
    return (
        <React.Fragment>
            <br />
            <div style={{ cursor: 'pointer', }} onClick={props.func()} >{time(props.time)}</div>
        </React.Fragment>
    )
}

export default Slots