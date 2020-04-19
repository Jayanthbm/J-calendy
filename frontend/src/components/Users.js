import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as EP from '../helpers/endpoints';
import * as Cookie from '../helpers/cookie';
import Spinner from './Spinner';
import Top from './Top';
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import {
    Container,
    Button,
    Modal, ModalBody, ModalHeader,
    FormInput,
    FormGroup,
    InputGroup,
    Alert
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
    const [fslots, setFslots] = useState(null);
    const [errorm, setErrorm] = useState(null);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [alert, setAlert] = useState('');
    const [visible, setVisible] = useState(true);
    async function getslots() {
        //TODO Clear intial values
        const bodyparameters = {
            date
        }
        let res = await axios.post(`${EP.LIST}/${id}`, bodyparameters);
        if (res.data.availableSlots) {
            setFslots(res.data.availableSlots);
        } else {
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
    function time(time) {
        if (time === 0) {
            return `12 AM`
        }
        if (time === 12) {
            return `${time} PM`
        }
        if (time < 12 && time > 0) {
            return `${time} AM`
        }
        if (time > 12) {
            return `${time - 12} PM`
        }
    }
    async function book() {
        if (selectedSlot) {
            setLoading(true);
            let bodyParameters = {
                eventDate: date,
                selectedSlots: {
                    [`${selectedSlot}`]: {
                        "available": false,
                        "booked": true
                    },
                    name,
                    email,
                    mobile
                }
            }
            let res = await axios.post(`${EP.BOOK}/${id}`, bodyParameters);
            if (res.data.message) {
                setAlert(res.data.message);
            }
            setLoading(false);
            setOpen(false)

        }
    }
    if (fslots) {
        for (let [key, value] of Object.entries(fslots)) {
            slots.push(key)
        }
    }
    if (loading === true || (fslots === null && errorm === null)) {
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
                        onChange={async (e) => {
                            slots.splice(0, slots.length);
                            setErrorm('');
                            setLoading(true);
                            setDp(e);
                            setDate(toISOLocal(e).split('T')[0]);
                            setFslots('');
                            setAlert('');
                            await getslots();
                            setLoading(false);
                        }}
                    />
                    {alert &&
                        <div style={{ textAlign: 'center', paddingLeft: '25%', paddingRight: '25%' }}><Alert dismissible={() => setVisible(false)} open={visible} theme="warning">{alert}</Alert></div>}
                    {!errorm && (
                        <h3>Available Slots</h3>
                    )}
                    {!errorm && slots.map((slot, index) => (
                        <div style={{
                            display: 'inline-block'
                        }} key={index}>
                            <Button id={slot} outline onClick={(e) => { setOpen(true); setSelectedSlot(e.target.id) }}> {time(slot)} </Button>
                            <span style={{
                                paddingLeft: 4,
                                paddingRight: 4
                            }}>
                            </span>
                            <Modal open={open} toggle={() => { setOpen(!open) }}>
                                <ModalHeader>Fill Details to Book a Slot</ModalHeader>
                                <ModalBody>
                                    <FormGroup>
                                        <label htmlFor="name">Name</label>
                                        <InputGroup seamless>
                                            <FormInput
                                                size="lg"
                                                name="name"
                                                placeholder="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                    <FormGroup>
                                        <label htmlFor="email">Email</label>
                                        <InputGroup seamless>
                                            <FormInput
                                                size="lg"
                                                name="email"
                                                placeholder="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                    <FormGroup>
                                        <label htmlFor="mobile">Mobile</label>
                                        <InputGroup seamless>
                                            <FormInput
                                                size="lg"
                                                name="mobile"
                                                placeholder="mobile"
                                                value={mobile}
                                                onChange={(e) => setMobile(e.target.value)}
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                    <FormGroup>
                                        <Button pill block onClick={book}>Book</Button>
                                    </FormGroup>
                                </ModalBody>
                            </Modal>
                        </div>
                    ))}
                </Container>
            </React.Fragment >
        )
    }
}
export default Users;