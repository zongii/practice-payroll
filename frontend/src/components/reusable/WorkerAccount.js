import React, { useEffect, useState } from 'react';
import * as tokenHandler from '../../modules/TokenHandler';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';

import styles from './WorkerAccount.module.css'
function WorkerAccount(props) {

    const [formData, setFormData] = useState({
        login: "",
        password: "",
        email: "",
        passwordRepeat: "",
    })

    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        setFormData({
            login: "",
            password: "",
            email: "",
            passwordRepeat: "",
        })

        setErrorMessage("");
    }, [props.accountData])

    function submitForm() {
        const userData = tokenHandler.getTokenData();

        if(userData.user === props.accountData["LOGIN"]) {
            setErrorMessage("Nie możesz modyfikować konta na którym jesteś zalogowany/a")
            return        
        }

        if(formData.password !== formData.passwordRepeat) {
            setErrorMessage("Hasła się różnią")
            return;
        }

        fetch(`http://localhost:2137/auth/modify`, 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({login: formData.login, password: formData.password, email: formData.email, workerID: props.accountData["WORKER_ID"], user: userData.user, token: userData.token})
        })
        .then(response => response.json())
        .then(res => {
            if(res.status === "OK") {
                
                setErrorMessage("Zmieniono ustawienia");
                props.update();
                props.refresh();
                return;
            }

            setErrorMessage(res.message);
        })
    }


    function removeAccount() {
        const userData = tokenHandler.getTokenData();

        if(userData.user === props.accountData["LOGIN"]) {
            setErrorMessage("Nie możesz modyfikować konta na którym jesteś zalogowany/a")
            return        
        }


        fetch(`http://localhost:2137/auth/delete`, 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({workerID: props.accountData["WORKER_ID"], user: userData.user, token: userData.token})
        })
        .then(response => response.json())
        .then(res => {
            if(res.status === "OK") {
                
                setErrorMessage("Usunięto konto");
                props.update();
                props.refresh();
                return;
            }

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

    if(props.accountData === null) return (
        <div className={styles.mainContainer}>
            <hr></hr>
            <h3>Ten pracownik nie ma założonego konta</h3>
            <hr></hr>
        </div>
    )
    return (
        <div className={styles.mainContainer}>
            <hr></hr>
            <h3>Informacje o koncie</h3>
            <p>Login: <b>{props.accountData["LOGIN"]}</b></p>
            <p>E-mail: <b>{props.accountData["MAIL"] ?? "-"}</b></p>
            <p>Poziom Uprawnień: <b>{props.accountData["ISADMIN"] === 1 ? "Administrator" : "Pracownik"}</b></p>
            <hr></hr>

            <h3>Zarządzanie kontem</h3>
            <Form.Label className={`text-white`}>Zmień Login</Form.Label>
            <Form.Control value={formData.login} onChange={handleFormUpdate} name="login" className={`bg-dark border-dark text-white ${styles.input}`} type="text"></Form.Control>

            <Form.Label className={`text-white`}>Zmień E-mail</Form.Label>
            <Form.Control value={formData.email} onChange={handleFormUpdate} name="email" className={`bg-dark border-dark text-white ${styles.input}`} type="text"></Form.Control>

            <Form.Label className={`text-white`}>Zmień Hasło</Form.Label>
            <Form.Control value={formData.password} onChange={handleFormUpdate} name="password" className={`bg-dark border-dark text-white ${styles.input}`} type="password"></Form.Control>
            
            <Form.Label className={`text-white`}>Powtórz Hasło</Form.Label>
            <Form.Control value={formData.passwordRepeat} onChange={handleFormUpdate} name="passwordRepeat" className={`bg-dark border-dark text-white ${styles.input}`} type="password"></Form.Control>
            
            <Form.Label className={`text-danger`}>{errorMessage}</Form.Label>
            
            <div className={styles.buttonGroup}>
                <Button onClick={submitForm} variant="warning" type="submit" className={styles.button}>Zmień Ustawienia</Button>
                <Button onClick={removeAccount} variant="danger" type="submit" className={styles.button}>Usuń konto</Button>

            </div>
        </div>
    );
}

export default WorkerAccount;