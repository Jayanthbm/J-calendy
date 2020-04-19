import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as EP from '../helpers/endpoints';
import * as Cookie from '../helpers/cookie';
import Spinner from './Spinner';
import Top from './Top';
import Member from './Member';

import {
    Container
} from "shards-react";
const Home = props => {
    const [loggedin, setLoggedin] = useState(null);
    const [users, setUsers] = useState(null);
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
        async function getlist() {
            let res = await axios.get(EP.LIST);
            if (res) {
                setUsers(res.data.users)
            }
        }
        setLoading(true);
        tokenchecker();
        getlist();
        setLoading(false);
    }, []);
    if (users === null || loading === true) {
        return (<Spinner loading="true" />);
    } else {
        return (
            <React.Fragment>
                <Container className="dr-example-container">
                    <Top loggedin={loggedin} />
                    <br />
                    <h3 style={{ textAlign: 'center', color: '#312eff' }}> Select Any User to Book a Slot</h3>
                    {users &&
                        users.map((el, i) => {
                            return (<Member id={el.userId} name={el.name} user={el.userId} />);
                        })
                    }
                </Container>
            </React.Fragment >
        )
    }

}

export default Home;