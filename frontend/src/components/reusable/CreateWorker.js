import React, { useEffect, useState } from 'react';

import styles from './CreateWorker.module.css'

import * as tokenHandler from '../../modules/TokenHandler';

import Form from 'react-bootstrap/Form';

function CreateWorker(props) {
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        sallary: 0
    })

    const [errorMessage, setErrorMessage] = useState("");

    function clickAction() {
        const userData = tokenHandler.getTokenData();

        if(formData.name === "") {
            setErrorMessage("Podaj Imię")
            return
        }

        if(formData.surname === "") {
            setErrorMessage("Podaj Nazwisko")
            return
        }

        if(formData.sallary <= 0 || formData.sallary > 1000000) {
            setErrorMessage("Pensja może zawierać się  przedziale 1 - 1000000")
            return
        }

        fetch(`http://localhost:2137/workers/create`, 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: formData.name, surname: formData.surname, sallary: formData.sallary, user: userData.user, token: userData.token})
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

    return (
        <div className={styles.mainContainer}>
            <Form.Label className={`text-white`}>Imię</Form.Label>
            <Form.Control value={formData.name} onChange={handleFormUpdate} name="name" className={`bg-dark border-dark text-white ${styles.input}`} type="text"></Form.Control>
            
            <Form.Label className={`text-white`}>Nazwisko</Form.Label>
            <Form.Control value={formData.surname} onChange={handleFormUpdate} name="surname" className={`bg-dark border-dark text-white ${styles.input}`} type="text"></Form.Control>
            
            <Form.Label className={`text-white`}>Pensja Zasadnicza</Form.Label>
            <Form.Control value={formData.sallary} onChange={handleFormUpdate} name="sallary" className={`bg-dark border-dark text-white ${styles.input}`} type="number" min={0} max={1000000}></Form.Control>
            
            <Form.Label className={`text-danger`}>{errorMessage}</Form.Label>
        </div>
    );
}

export default CreateWorker;