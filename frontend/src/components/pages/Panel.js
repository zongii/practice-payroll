import React, { useEffect, useState } from 'react';
import * as tokenHandler from '../../modules/TokenHandler';
import * as Icon from 'react-bootstrap-icons';

import { BarChart, Bar, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

import styles from './Panel.module.css';

import PopupModal from '../reusable/PopupModal'

function Panel(props) {
    const months = ["STY", "LUT", "MAR", "KWI", "MAJ", "CZE", "LIP", "SIE", "WRZ", "PAZ", "LIS", "GRU"];
    const monthsFull = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];

    const [workerData, setWorkerData] = useState(null)
    const [accountData, setAccountData] = useState(null)
    
    const [modalState, setModalState] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")
    const [updateState, setUpdateState] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        passwordRepeat: "",
        currentPassword: ""
    })

    function getMonthlyData(data) {
        if(data === null) return null;
        return months.map((month, index) => { return {
                mies:  month,
                pruzn: data[`PREMIA_UZN_${month}`],
                prcal: data[`PREMIA_CAL_${month}`],
                pecal: data[`PENSJA_CAL_${month}`]
            }}
        )
    }

    function getBasicStats(data) {
        if(data === null) return null;
        return [{
            name: "Pensja",
            base: data[`PENSJA_ZASADNICZA`],
            min: data[`PENSJA_MIN`],
            max: data[`PENSJA_MAX`],
            avg: data[`PENSJA_SR`]
        },{
            name: "Premia",
            base: data[`PREMIA_MOTYW`],
            min: data[`PREMIA_MIN`],
            max: data[`PREMIA_MAX`],
            avg: data[`PREMIA_SR`]
        }]
    }
    useEffect(() => {
        const userData = tokenHandler.getTokenData();

        fetch(`http://localhost:2137/user/me`, 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user: userData.user, token: userData.token})
        })
        .then(response => response.json())
        .then(res => {
            if(res.status === "OK") {
                setWorkerData(res.workerData);
                setAccountData(res.accountData);
            }
        })
    }, [updateState])

    function clickAction() {
        const userData = tokenHandler.getTokenData();

        if(formData.currentPassword === "") {
            setErrorMessage("Podaj obecne hasło");
            return;
        }
        
        if(formData.password !== formData.passwordRepeat) {
            setErrorMessage("Hasła nie są takie same");
            return;
        }

        fetch(`http://localhost:2137/user/modify`, 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password: formData.password, currentPassword: formData.currentPassword, email: formData.email, user: userData.user, token: userData.token})
        })
        .then(response => response.json())
        .then(res => {
            if(res.status === "OK") {
                console.log(userData)
                
                tokenHandler.saveTokenData(res.user, res.token);
                let temp = tokenHandler.getTokenData();
                console.log(temp);
                
                setErrorMessage("");
                toggleModalState(false);
                console.log(res)
                setUpdateState(prev => !prev);
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

    function toggleModalState(state) {
        setModalState(state);
    }

    return (
        <div className={styles.mainContainer}>
            {/* <PopupModal 
                active={modalState}
                title={"Zmień dane konta"}
                action={clickAction}
                close={() => toggleModalState(false)}
            >

                <Form.Label className={`text-white`}>Zmień Mail</Form.Label>
                <Form.Control value={formData.email} onChange={handleFormUpdate} name="email" className={`bg-dark border-dark text-white ${styles.input}`} type="text"></Form.Control>
                
                <Form.Label className={`text-white`}>Zmień Hasło</Form.Label>
                <Form.Control value={formData.password} onChange={handleFormUpdate} name="password" className={`bg-dark border-dark text-white ${styles.input}`} type="password"></Form.Control>
                
                <Form.Label className={`text-white`}>Powtórz Nowe Hasło</Form.Label>
                <Form.Control value={formData.passwordRepeat} onChange={handleFormUpdate} name="passwordRepeat" className={`bg-dark border-dark text-white ${styles.input}`} type="password"></Form.Control>
                
                <Form.Label className={`text-white`}>Podaj Obecne Hasło (Wymagane)</Form.Label>
                <Form.Control value={formData.currentPassword} onChange={handleFormUpdate} name="currentPassword" className={`bg-dark border-dark text-white ${styles.input}`} type="password"></Form.Control>
                
                <Form.Label className={`text-danger`}>{errorMessage}</Form.Label>
                    
            </PopupModal> */}
            <div className={`${styles.panel} ${styles.backdrop}`}>
                <div className={styles.userCard}>
                    <Icon.PersonCircle className={styles.icon} />
                    {workerData !== null && accountData !== null && (
                        <>
                            <h2>{workerData["IMIE"]} {workerData["NAZWISKO"]}</h2>
                            <h3>{accountData["ISADMIN"] === 1 ? "Administrator" : "Pracownik"}</h3>
                            <h4>Podstawowe dane</h4>
                            <p>Imię: <b>{workerData["IMIE"] ?? "-"}</b></p>
                            <p>Nazwisko: <b>{workerData["NAZWISKO"] ?? "-"}</b></p>
                            <h4>Informacje o koncie</h4>
                            <p>Login: <b>{accountData["LOGIN"] ?? "-"}</b></p>
                            <p>Email: <b>{accountData["MAIL"] ?? "-"}</b></p>
                            <p>Poziom uprawnień: <b>{accountData["ISADMIN"] === 1 ? "Administrator" : "Pracownik"}</b></p>
                            <div className={styles.spacer}></div>
                            {/* <Button onClick={() => toggleModalState(true)} variant="warning" type="submit" className={styles.button}>Zmień dane konta</Button> */}
                            <Button onClick={props.logoutRef} variant="warning" type="submit" className={styles.button}>Wyloguj</Button>
                        </>
                    )}
                    
                </div>
            </div>
            <div className={`${styles.panel} ${styles.vertical}`}>
                {workerData !== null && (
                <>
                    <h4>Statystyki płacy</h4>
                    <Table className={`border-dark`} striped bordered hover variant="dark">
                        <thead className={styles.thead}>
                            <tr>
                                <th>Pensja Zasadnicza</th>
                                <th>Pensja Minimalna</th>
                                <th>Pensja Maksymalna</th>
                                <th>Pensja Średnia</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className={styles.rowHover} >
                                <td>{workerData["PENSJA_ZASADNICZA"]}</td>
                                <td>{workerData["PENSJA_MIN"]}</td>
                                <td>{workerData["PENSJA_MAX"]}</td>
                                <td>{workerData["PENSJA_SR"]}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <h4>Statystyki premii</h4>
                    <Table className={`border-dark`} striped bordered hover variant="dark">
                        <thead className={styles.thead}>
                            <tr>
                                <th>Premia Motywacyjna</th>
                                <th>Premia Minimalna</th>
                                <th>Premia Maksymalna</th>
                                <th>Premia Średnia</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className={styles.rowHover} >
                                <td>{workerData["PREMIA_MOTYW"]}</td>
                                <td>{workerData["PREMIA_MIN"]}</td>
                                <td>{workerData["PREMIA_MAX"]}</td>
                                <td>{workerData["PREMIA_SR"]}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <h4>Dane miesięczne</h4>
                    <Table striped bordered hover variant="dark">
                        <thead className={styles.thead}>
                            <tr>
                                <th></th>
                                <th>Premia Uznaniowa</th>
                                <th>Premia Całkowita</th>
                                <th>Pensja Całkowita</th>
                            </tr>
                        </thead>
                        <tbody>
                            {months.map((month, index) => {
                                return (
                                    <tr className={styles.rowHover} >
                                        <th>{monthsFull[index]}</th>
                                        <td>{workerData[`PREMIA_UZN_${month}`]}</td>
                                        <td>{workerData[`PREMIA_CAL_${month}`]}</td>
                                        <td>{workerData[`PENSJA_CAL_${month}`]}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>    
                </>
                )}
            </div>
            <div className={`${styles.panel} ${styles.vertical}`}>
            <div className={`${styles.panel} ${styles.backdrop}`}>
                    <div className={styles.normal}>
                        <p>Dane miesięczne</p>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                            width={500}
                            height={300}
                            data={getBasicStats(workerData)}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 0,
                                bottom: 30,
                            }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: "#212529",
                                        border: "none",
                                        borderRadius: "10px"
                                    }}
                                />
                                <Legend />
                                <Bar name="Zasadnicza" dataKey="base" fill="#7975c6" />
                                <Bar name="Minimalna" dataKey="min" fill="#67c088" />
                                <Bar name="Średnia" dataKey="avg" fill="#c9a964" />
                                <Bar name="Maksymalna" dataKey="max" fill="#bf6464" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className={`${styles.panel} ${styles.backdrop}`}>
                    <div className={styles.normal}>
                        <p>Dane miesięczne</p>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                            data={getMonthlyData(workerData)}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 0,
                                bottom: 30,
                            }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mies" />
                                <YAxis />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: "#212529",
                                        border: "none",
                                        borderRadius: "10px"
                                    }}
                                />
                                <Legend />
                                <Line type="monotone" strokeWidth={3} dataKey="pruzn" name="Premia uzn." stroke="#00ff2a" />
                                <Line type="monotone" strokeWidth={3} dataKey="prcal" name="Premia cal." stroke="#ffd500" />
                                <Line type="monotone" strokeWidth={3} dataKey="pecal" name="Pensja cal." stroke="#ca8282" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Panel;