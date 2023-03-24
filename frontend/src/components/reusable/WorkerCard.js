import React, { useEffect, useState } from 'react';
import * as tokenHandler from '../../modules/TokenHandler';

import Table from 'react-bootstrap/Table';

import * as Icon from 'react-bootstrap-icons';
import styles from './WorkerCard.module.css'
import WorkerAccount from './WorkerAccount';

function WorkerCard(props) {
    const months = ["STY", "LUT", "MAR", "KWI", "MAJ", "CZE", "LIP", "SIE", "WRZ", "PAZ", "LIS", "GRU"];
    const monthsFull = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];

    const [updateData, setUpdateData] = useState(false);

    const [accountData, setAccountData] = useState(null);

    useEffect(() => {
        const userData = tokenHandler.getTokenData();
        if(props.workerData === null) return; 
        fetch(`http://localhost:2137/workers/byid`, 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({workerID: props.workerData["ID"], user: userData.user, token: userData.token})
        })
        .then(response => response.json())
        .then(res => {
            console.log(res);
            if(res.status !== "OK") {
                setAccountData(null);
                return;
            }
            if(res.count !== 1) {
                setAccountData(null);
                return;
            }
            setAccountData(res.rows[0]);
            return;
        })
    }, [props.workerData, updateData])

    function handleUpdateData() {
        setUpdateData(prev => !prev)
    }

    if(props.workerData === null) return (
        <div className={styles.mainContainer}>
            <div className={styles.containerHeading}>
                <h2>Karta Pracownika</h2>
            </div>
            <p className={`text-white`}>Wybierz pracownika z listy</p>
        </div>
    )

    return (
        <div className={`panel-body ${styles.mainContainer}`}>
            <div className={styles.containerHeading}>
                <div className={styles.buttonGroup}>
                    <h2>{props.workerData["IMIE"]} {props.workerData["NAZWISKO"]}</h2>
                    {accountData !== null && <p>{accountData["LOGIN"]}</p>}
                </div>

                <div className={styles.buttonGroup}>
                    
                    {accountData === null && (
                         <div onClick={props.openModal} className={styles.addButton}>
                            <Icon.PersonAdd className={styles.icon} color="white"/>
                        </div>
                    )}

                    <div onClick={()=>props.deleteRef(props.workerData["ID"])} className={styles.closeButton}>
                        <Icon.TrashFill className={styles.icon} color="white"/>
                    </div>

                    
                </div>
            </div>
            <Table className={`border-dark`} striped bordered hover variant="dark">
                <thead className={styles.thead}>
                    <tr>
                        <th>Pensja Zasadnicza</th>
                        <th>Premia Motyw.</th>
                        <th>Pensja Min.</th>
                        <th>Pensja Max.</th>
                        <th>Pensja Śr.</th>
                        <th>Premia Min.</th>
                        <th>Premia Max.</th>
                        <th>Premia Śr.</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className={styles.rowHover} >
                        <td>{props.workerData["PENSJA_ZASADNICZA"]}</td>
                        <td>{props.workerData["PREMIA_MOTYW"]}</td>
                        <td>{props.workerData["PENSJA_MIN"]}</td>
                        <td>{props.workerData["PENSJA_MAX"]}</td>
                        <td>{props.workerData["PENSJA_SR"]}</td>
                        <td>{props.workerData["PREMIA_MIN"]}</td>
                        <td>{props.workerData["PREMIA_MAX"]}</td>
                        <td>{props.workerData["PREMIA_SR"]}</td>
                    </tr>
                </tbody>
            </Table>
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
                                <td>{props.workerData[`PREMIA_UZN_${month}`]}</td>
                                <td>{props.workerData[`PREMIA_CAL_${month}`]}</td>
                                <td>{props.workerData[`PENSJA_CAL_${month}`]}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <WorkerAccount 
                accountData={accountData}
                update={handleUpdateData}
                refresh={props.refresh}
            /> 
        </div>
    );
}

export default WorkerCard;