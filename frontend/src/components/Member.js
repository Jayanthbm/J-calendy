import React from 'react';
import { Link } from "react-router-dom";
const Member = props => {
    return (
        <React.Fragment>
            <br />
            <Link style={{ color: '#312eff', textDecoration: 'none' }} to={`/users/${props.user}`}>
                <div style={{
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    boxShadow: '5rem 5rem 20rem rgba(49, 46, 255, 0.15)',
                    textAlign: "center"

                }} >
                    <div style={{ color: '#312eff', fontSize: 50 }}>
                        {props.name}
                    </div>
                </div>
            </Link>

        </React.Fragment>
    )
}

export default Member