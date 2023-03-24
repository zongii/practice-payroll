import React, { useState } from 'react';

import styles from './PopupModal.module.css'

function PopupModal(props) {
    if(!props.active) return <></>

    return (
        <div className={styles.mainContainer}>
            <div className={`bg-dark ${styles.popupCard}`}>
                <div className={styles.cardHeader}>
                    <p>{props.title}</p>
                </div>
                <div className={styles.content}>
                    {props.children}
                </div>
                <div className={styles.cardFooter}>
                    <div onClick={props.action} className={`${styles.modalButton} ${styles.accept}`}><p>Zatwierdź</p></div>
                    <div onClick={props.close} className={styles.modalButton}><p>Anuluj</p></div>
                </div>
            </div>
        </div>
    );
}

export default PopupModal;