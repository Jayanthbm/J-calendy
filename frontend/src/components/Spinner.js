import React from 'react'
import '../css/loader.css';

const Spinner = props => {
    if (props.loading) {
        return (
            <div className="sampleContainer">
                <div className="loader">
                    <span className="dot dot_1"></span>
                    <span className="dot dot_2"></span>
                    <span className="dot dot_3"></span>
                    <span className="dot dot_4"></span>
                </div>
            </div>
        )
    } else {
        return null;
    }
}

export default Spinner;