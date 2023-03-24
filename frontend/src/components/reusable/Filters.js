import Button from 'react-bootstrap/Button';
import React from 'react';

import Form from 'react-bootstrap/Form';

import styles from './Filters.module.css'

function Filters(props) {
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
        <div className={`d-grid ${styles.mainContainer}`}>
            <Form.Label htmlFor="sort" className={`text-white`}>Sortuj według wartości</Form.Label>
            <Form.Select name="filterColumn" onChange={props.updateRef} id="sort" className={`form-select bg-dark border-dark text-white`}>
                <option value="null">Bez Sortowania</option>
            {
                            props.list && 
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
                                if(finalName === "ID") return <></>;
                                if(finalName === "Imie") return <></>;
                                if(finalName === "Nazwisko") return <></>;

                                return <option value={element} key={index}>{finalName}</option>
                            })
                        }

                
            </Form.Select>
            <br></br>
            
            <Form.Label htmlFor="from" className={`text-white`}>Sortuj od kwoty</Form.Label>
            <Form.Control name="filterValueFrom" min="0" onChange={props.updateRef} id="from" className={`bg-dark border-dark text-white`} type="number" placeholder="Kwota od" />
            <br></br>

            <Form.Label htmlFor="to" className={`text-white`}>Sortuj do kwoty</Form.Label>
            <Form.Control name="filterValueTo" min="0" onChange={props.updateRef} id="to" className={`bg-dark border-dark text-white`} type="number" placeholder="Kwota do" />
            <br></br>

            <Button variant="outline-warning" type="submit" onClick={props.applyRef} className=''>Filtruj Dane</Button>
        </div>
    );
}

export default Filters;