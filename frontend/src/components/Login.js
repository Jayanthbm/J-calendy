import React, { useState, useEffect } from 'react';
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';
import * as EP from '../helpers/endpoints';
import * as Cookie from '../helpers/cookie';
import Top from './Top';
import {
    Form,
    FormInput,
    FormGroup,
    Container,
    InputGroup,
    Button,
    Alert
} from "shards-react";

import Spinner from './Spinner';

const Login = props => {
    const [visible, setVisible] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedin, setLoggedin] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
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
        tokenchecker();
    }, []);
    async function login() {
        setErrorMessage('');
        setLoading(true);
        const bodyParameters = {
            emailId: username,
            password
        };
        try {
            let res = await axios.post(EP.LOGIN, bodyParameters);
            if (res.data.token) {
                Cookie.createCookieInMinutes("token", res.data.token, 180)
                setLoggedin(true);
                setLoading(false);
            } else {
                setErrorMessage(res.data.message);
                setLoading(false);
            }
        } catch (error) {
            setErrorMessage("Error During Login");
            setLoading(false);
        }

    }
    if (loggedin === null || loading === true) {
        return (<Spinner loading="true" />);
    }
    if (loggedin === true) {
        return (<Redirect to={'/schedules'} />);
    }
    if (loggedin === false) {
        return (
            <React.Fragment>
                <Container className="dr-example-container">
                    <Top loggedin={loggedin} />
                    <h2 style={{ textAlign: 'center', paddingTop: 20, paddingBottom: 10 }}>Login</h2>
                    {errorMessage &&
                        <div style={{ textAlign: 'center', paddingLeft: '25%', paddingRight: '25%' }}><Alert dismissible={() => setVisible(false)} open={visible} theme="danger">{errorMessage}</Alert></div>}
                    <div style={{ display: 'flex' }}>
                        <Form style={{ margin: 'auto' }}>
                            <FormGroup>
                                <label htmlFor="username">Email</label>
                                <InputGroup seamless>
                                    <FormInput
                                        size="lg"
                                        name="username"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="password">Password</label>
                                <InputGroup seamless>
                                    <FormInput
                                        size="lg"
                                        name="password"
                                        placeholder="Password"
                                        type="password"
                                        value={password}
                                        autoComplete="on"
                                        onChange={(e) => setPassword(e.target.value)} />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <Button pill block onClick={login}>Login</Button>
                            </FormGroup>
                            Don't have an Account <Link to='/signup'>Click here</Link>
                        </Form>
                    </div>
                </Container>
            </React.Fragment>
        )
    }

}

export default Login;