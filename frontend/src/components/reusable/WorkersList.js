import React, { useEffect } from 'react';
import Table from 'react-bootstrap/Table';

import styles from './WorkersList.module.css'
function WorkersList(props) {

    function translateShorts(text) {
        let finalName = text;
        finalName = finalName.replace("Motyw", "Motywacyjna");
        finalName = finalName.replace("Id", "ID");

        finalName = finalName.replace("Uzn", "Uznaniowa");
        finalName = finalName.replace("Cal", "Całkowita");
        finalName = finalName.replace("Min", "Minimalna");
        finalName = finalName.replace("Max", "Maksymalna");
        finalName = finalName.replace("Sr", "Średnia");

        finalName = finalName.replace("Sty", "Styczeń");
        finalName = finalName.replace("Lut", "Luty");
        finalName = finalName.replace("Mar", "Marzec");
        finalName = finalName.replace("Kwi", "Kwiecień");

        finalName = finalName.replace("Maj", "Maj");
        finalName = finalName.replace("Cze", "Czerwiec");
        finalName = finalName.replace("Lip", "Lipiec");
        finalName = finalName.replace("Sie", "Sierpień");

        finalName = finalName.replace("Wrz", "Wrzesień");
        finalName = finalName.replace("Paz", "Październik");
        finalName = finalName.replace("Lis", "Listopad");
        finalName = finalName.replace("Gru", "Grudzień");


        return finalName
    }

    return (
        <div className={styles.mainContainer}>
            <Table striped bordered hover variant="dark">
                <thead className={styles.thead}>
                    <tr>
                        {
                            props.list !== null && 
                            props.list.length > 0 &&
                            Object.keys(props.list[0]).map((element, index) => {
                                let name = element;
                                name = name.split("_");
                                let finalName = "";

                                name.forEach((str, index) => {
                                    let temp = str.toLowerCase();
                                    finalName += temp.charAt(0).toUpperCase() + temp.slice(1);
                                    if(index !== name.length-1) finalName += " ";
                                });

                                
                                finalName = translateShorts(finalName);

                                if(finalName.endsWith("Pr")) return <></>;
                                if(finalName === "R  ") return <></>;

                                return <th key={index}>{finalName}</th>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                {
                    props.list !== null && 
                    props.list.map((element,index) => {
                        return (
                            <tr 
                                onClick={() => props.selectRef(element)}
                                className={styles.rowHover} 
                                key={index}
                            >
                            {
                                Object.keys(element).map((val, indx) => {

                                    if(val.endsWith("PR")) return <></>;
                                    if(val === "R__") return <></>;

                                    return <td key={indx}>{element[val]}</td>
                                })
                            }
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
        </div>
    );
}

export default WorkersList;