import React from 'react';
import * as Icon from 'react-bootstrap-icons';
import Dropdown from 'react-bootstrap/Dropdown';

import {
    Link, useLocation
} from "react-router-dom";

import styles from './NavBar.module.css'

function NavBar(props) {

    const location = useLocation();

    return (
        <div className={`${styles.mainContainer}`}>
            <Icon.BuildingsFill className={styles.logoIcon}/>
            <h4 className={`${styles.logoText}`}>Manager Pracy</h4>
            <Link className={`${styles.link} ${location.pathname === '/panel' && styles.activePath}`} to="/panel">Panel</Link>
            {props.isAdmin && <Link className={`${styles.link} ${location.pathname === '/admin' && styles.activePath}`} to="/admin">Zarządzaj</Link>}
            
            <div className={styles.spacer}></div> 

            {location.pathname === '/admin' && (
            <button onClick={props.clickButton} className={`${styles.group2}`}>
                <Icon.DatabaseAdd className={styles.smallIcon} />
                <p className={styles.userName}>Dodaj Pracownika</p>

                <div className={styles.dropDown}>
                    <p onClick={props.logoutRef}>Wyloguj</p>
                </div>

            </button>
            )}

            <button className={styles.group}>
                <p className={styles.userName}>{props.user}</p>
                <Icon.PersonCircle className={styles.userIcon} />

                <div className={styles.dropDown}>
                    <p onClick={props.logoutRef}>Wyloguj</p>
                </div>

            </button>
 
                
        </div>
    );
}

export default NavBar;