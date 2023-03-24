import React, { useState } from 'react';

import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import * as Icon from 'react-bootstrap-icons';
import * as tokenHandler from '../../modules/TokenHandler';

import styles from './Login.module.css'


function Login(props) {

    const [formData, setFormData] = useState({
        login: "",
        password: "",
        stayLogged: true
    })

    const [errorMessage, setErrorMessage] = useState("")


    function login() {
        fetch(`http://localhost:2137/auth/signin`, 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({login: formData.login, password: formData.password})
        })
        .then(response => response.json())
        .then(res => {
            if(res.status === "OK") {
                const user = res.user
                const isAdmin = res.isAdmin;
                const token = res.token
                
                if(formData.stayLogged) {
                    tokenHandler.saveTokenData(user, token)
                }
                else {
                    tokenHandler.tempSaveTokenData(user, token)
                }

                props.setLogged(true);
                props.setAdmin(isAdmin);
                props.setUser(res.user)
                return;
            }
            console.log(res);
            setErrorMessage(res.message);
        })
    }

    function handleFormUpdate(event) {
        const target = event.currentTarget;

        if(target.name) {
            setFormData(prevState => {
                return ({
                    ...prevState,
                    [target.name]: target.value
                })
            })
        }
    }

    function handleCheckBox() {
        setFormData(prevState => {
            
            return ({
                ...prevState,
                stayLogged: !prevState.stayLogged
            })
        })
    }

    return (
        <div className={`bg-dark ${styles.mainContainer}`}>
            <Card className={`${styles.card}`}>
                <div className={styles.group}>
                    <Icon.PersonCircle color="white" className={styles.icon}/>
                    <Card.Title className={`text-white ${styles.title}`}>Zaloguj Się</Card.Title>
                </div>
                <div className={styles.group}>
                    <Form.Label className={`text-white ${styles.label}`} htmlFor="login">Login</Form.Label>
                    <Form.Control onChange={handleFormUpdate} value={formData.login} name="login" className={`bg-dark border-dark text-white ${styles.input}`} id="login" type='text' placeholder='Login'></Form.Control>
                    <Form.Label className={`text-white ${styles.label}`} htmlFor="pass">Hasło</Form.Label>
                    <Form.Control onChange={handleFormUpdate} value={formData.password} name="password"  className={`bg-dark border-dark text-white ${styles.input}`} id="pass" type='password' placeholder='Hasło'></Form.Control>
                    <div className={styles.inline}>
                        <Form.Check onChange={handleCheckBox} checked={formData.stayLogged} className={`${styles.checkBox}`} id="staylogged" />
                        <Form.Label className={`text-white ${styles.label}`} htmlFor="staylogged">Nie wylogowuj</Form.Label>
                    </div>
                </div>
                
                <div className={`${styles.group} ${styles.margin}`}>
                    <Form.Label className={`text-danger ${styles.label}`}>{errorMessage}</Form.Label>
                    <Button onClick={login} variant="warning" type="submit" className={styles.button}>Zaloguj</Button>
                </div>
            </Card>
        </div>
    );
}

export default Login;