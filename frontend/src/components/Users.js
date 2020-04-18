import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as EP from '../helpers/endpoints';
import * as Cookie from '../helpers/cookie';
import Spinner from './Spinner';
import Top from './Top';
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import {
    Container
} from "shards-react";

const Users = props => {

    function toISOLocal(d) {
        var z = n => ('0' + n).slice(-2);
        var zz = n => ('00' + n).slice(-3);
        var off = d.getTimezoneOffset();
        var sign = off < 0 ? '+' : '-';
        off = Math.abs(off);

        return d.getFullYear() + '-'
            + z(d.getMonth() + 1) + '-' +
            z(d.getDate()) + 'T' +
            z(d.getHours()) + ':' +
            z(d.getMinutes()) + ':' +
            z(d.getSeconds()) + '.' +
            zz(d.getMilliseconds()) +
            sign + z(off / 60 | 0) + ':' + z(off % 60);
    }

    let { id } = useParams();
    let slots = [];
    const [loggedin, setLoggedin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(toISOLocal(new Date()).split('T')[0]);
    const [dp, setDp] = useState(new Date());
    const [fslots, setFslots] = useState('');
    const [errorm, setErrorm] = useState('');

    async function getslots() {
        setLoading(true);
        //TODO Clear intial values
        const bodyparameters = {
            date
        }
        let res = await axios.post(`${EP.LIST}/${id}`, bodyparameters);
        if (res.data.availableSlots) {
            setFslots('');
            setErrorm('')
            setFslots(res.data.availableSlots)

        } else {
            setFslots('');
            setErrorm('')
            setErrorm(res.data.message)
        }
        setLoading(false);
        return 1;
    }
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
        getslots();
        setLoading(false);
    }, []);
    async function update_slots(d) {
        setFslots({})
        setErrorm('');
        slots.splice(0, slots.length)
        setDp(d)
        setDate(toISOLocal(d).split('T')[0]);
        await getslots()

    }
    if (fslots) {
        for (let [key, value] of Object.entries(fslots)) {
            slots.push(key)
        }


    }
    if (loading === true || (fslots.length === 0 && errorm.length === 0)) {
        return (<Spinner loading="true" />);
    } else {
        return (
            <React.Fragment>
                <Container className="dr-example-container">
                    <Top loggedin={loggedin} />
                    <br />
                    {errorm && (
                        <h2>{errorm}</h2>
                    )}
                    <DatePicker
                        selected={dp}
                        onChange={async (e) => { await update_slots(e) }}
                    />
                    {!errorm && (
                        <h3>Available Slots</h3>
                    )}
                    {slots.map((slot, index) => (
                        <div key={index}>
                            {slot}
                        </div>
                    ))}
                </Container>
            </React.Fragment >
        )
    }
}
export default Users;