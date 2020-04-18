import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as EP from '../helpers/endpoints';
import * as Cookie from '../helpers/cookie';
import Spinner from './Spinner';
import Top from './Top';
import { Redirect, Link, useParams } from "react-router-dom";
import {
    Container
} from "shards-react";

const Users = props => {
    let { id } = useParams();
    const [loggedin, setLoggedin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState(null)
    const [errorm, setErrorm] = useState('');
    useEffect(() => {
        async function tokenchecker() {
            const token = Cookie.getCookie("token");
            if (token) {
                setLoggedin(true);
            } else {
                setLoggedin(false);
            }
        }
        async function getslots() {
            const bodyparameters = {
                date: '2020-02-01'
            }
            let res = await axios.get(`${EP.LIST}/${id}`, bodyparameters)
            if (res.data.messsage) {
                setErrorm(res.data.messsage)
            } else {
                setSlots(res.data.availableSlots)
            }
        }
        setLoading(true);
        tokenchecker();
        getslots();
        setLoading(false);
    }, []);

    if (loading === true) {
        return (<Spinner loading="true" />);
    } else {
        return (
            <React.Fragment>
                <Container className="dr-example-container">
                    <Top loggedin={loggedin} />
                    <br />
                    {errorm &&
                        <h3>{errorm}</h3>
                    }
                </Container>
            </React.Fragment >
        )
    }
}
export default Users;