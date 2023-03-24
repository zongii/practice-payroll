import React, { useEffect, useState } from 'react';
import * as tokenHandler from '../../modules/TokenHandler';

import Form from 'react-bootstrap/Form';

import styles from './CreateAccount.module.css'
function CreateAccount(props) {

    const [formData, setFormData] = useState({
        login: "",
        password: "",
        passwordRepeat: ""
    })

    const [errorMessage, setErrorMessage] = useState("");

    function clickAction() {
        const userData = tokenHandler.getTokenData();
        fetch(`http://localhost:2137/auth/create`, 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({login: formData.login, password: formData.password, email: "", workerID: props.workerData["ID"], user: userData.user, token: userData.token})
        })
        .then(response => response.json())
        .then(res => {
            if(res.status === "OK") {
                
                setErrorMessage("");
                props.closeModal();
                props.refresh();
                return;
            }

            setErrorMessage(res.message);
        })
    }

    useEffect(() => {
        clickAction();
    }, [props.clickToggle])
    

    useEffect(() => {
        if(formData.password !== formData.passwordRepeat) {
            setErrorMessage("Hasła się różnią");
            return
        }
        setErrorMessage("");
    }, [formData])

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

    if(props.workerData === null) return <></>
    
    return (
        <div className={styles.mainContainer}>
            <p>Pracownik: <b>{props.workerData["IMIE"]} {props.workerData["NAZWISKO"]}</b></p>
            <Form.Label className={`text-white`}>Zdefiniuj Login</Form.Label>
            <Form.Control value={formData.login} onChange={handleFormUpdate} name="login" className={`bg-dark border-dark text-white ${styles.input}`} type="text"></Form.Control>
            <Form.Label className={`text-white`}>Zdefiniuj Hasło</Form.Label>
            <Form.Control value={formData.password} onChange={handleFormUpdate} name="password" className={`bg-dark border-dark text-white ${styles.input}`} type="password"></Form.Control>
            <Form.Label className={`text-white`}>Powtórz Hasło</Form.Label>
            <Form.Control value={formData.passwordRepeat} onChange={handleFormUpdate} name="passwordRepeat" className={`bg-dark border-dark text-white ${styles.input}`} type="password"></Form.Control>
            <Form.Label className={`text-danger`}>{errorMessage}</Form.Label>
        </div>
    );
}

export default CreateAccount;