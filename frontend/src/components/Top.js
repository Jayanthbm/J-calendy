import React, { useState } from 'react'
import {
    Navbar,
    NavbarBrand,
    Button,
    Nav,
} from "shards-react";

import { Redirect, Link } from "react-router-dom";
import * as Cookie from '../helpers/cookie';
const Top = props => {
    const [redirect, setRedirect] = useState(false);
    if (redirect === true) {
        return (<Redirect to='/' />);
    } else {
        return (
            <div style={{ paddingTop: 10 }}>
                <Navbar type="dark" theme="secondary" expand="md">
                    <NavbarBrand>
                        <h3 style={{ color: '#fff' }}>J-Calendy</h3>
                    </NavbarBrand>
                    <Nav navbar className="ml-auto">
                        <Link to="/"><Button theme="success" pill>Home</Button></Link>
                        &nbsp;
                        <Link to="/schedules"><Button theme="info" pill>Schedule Events</Button></Link>
                        &nbsp;
                        <Link to="/booking"><Button theme="warning" pill>Bookings</Button></Link>
                        &nbsp;
                        {props.loggedin === true && <Button theme="danger" pill onClick={() => {
                            try {
                                Cookie.deleteCookie("token");
                                setRedirect(true);
                            } catch (error) {
                                setRedirect(true);
                            }
                        }}>Logout</Button>}
                    </Nav>
                </Navbar>
            </div>
        )
    }
}
export default Top;