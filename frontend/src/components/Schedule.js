import React, { useState, useEffect } from 'react';
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';
import * as EP from '../helpers/endpoints';
import * as Cookie from '../helpers/cookie';
import Top from './Top';

import {
    Container,
} from "shards-react";

import Spinner from './Spinner';

const Schedule = props => {
    const [loggedin, setLoggedin] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function tokenchecker() {
            const token = Cookie.getCookie("token");
            if (token) {
                setLoggedin(true);
            } else {
                setLoggedin(false);
            }
        }
        setLoading(true);
        tokenchecker();
        setLoading(false);
    }, []);

    if (loggedin === null || loading === true) {
        return (<Spinner loading="true" />);
    }

    if (loggedin === false) {
        return (<Redirect to={'/login'} />);
    }
    if (loggedin === true) {
        return (
            <React.Fragment>
                <Container className="dr-example-container">
                    <Top loggedin={loggedin} />
                </Container>
            </React.Fragment>
        )
    }

}

export default Schedule;