import React, { useEffect, useRef, useState } from 'react';

import styles from './Pagination.module.css'
function Pagination(props) {
    let myref = useRef();
    
    const [elementWidth, setElementWidth] = useState(null);
    const [boxCount, setBoxCount] = useState(0);
    const [boxOffset, setBoxOffset] = useState(0);



    useEffect(() => {
        function handleResize() {
            setElementWidth(myref.current.offsetWidth);
            console.log(myref.current.offsetWidth);
        }
        
        handleResize();
        window.addEventListener('resize', handleResize)

        return (() => {
            console.log("CLEANUP")
            window.removeEventListener('resize', this);
        })
    }, [props.pageCount, props.pageSelected])

    useEffect(() => {
        setBoxCount(prev => {
            let temp = getBoxCount(elementWidth);

            setBoxOffset(getBoxOffset(temp, props.pageSelected))

            return temp;
        });
    }, [elementWidth, props.pageSelected, props.pageCount])

    if(props.pageCount === 0) return <></>

    function getBoxCount(wid) {
        if(wid === null) return props.pageCount

        return Math.min(Math.round((wid - 200)/40),props.pageCount);
    }

    function getBoxOffset(wid, sel) {
        if(Math.ceil(wid/2) >= sel) return 0;
        if(props.pageCount-Math.floor(wid/2) < sel) return Math.floor(sel-wid+(props.pageCount-sel));
        return Math.floor(sel-wid/2)
    }

    return (
        <div ref={myref} className={styles.mainContainer}>
           <div
            onClick={() => props.onPageChange(1)} 
            className={`${styles.pageBox} ${props.pageSelected === 1 && styles.inactive}`}>{props.prevSymbol}{props.prevSymbol}</div> 

           <div
            onClick={() => props.onPageChange(props.pageSelected-1)} 
            className={`${styles.pageBox} ${props.pageSelected === 1 && styles.inactive}`}>{props.prevSymbol}</div> 

            {
                [...Array(boxCount).keys()].map(element => {
                    if(element+1+boxOffset > props.pageCount) return <></>

                    return <div 
                                key={element} 
                                onClick={() => props.onPageChange(element+1+boxOffset)} 
                                className={`${styles.pageBox} ${props.pageSelected == element+1+boxOffset && styles.pageSelected}`}>{element+1+boxOffset}</div> 
                })
            }

            <div 
                onClick={() => props.onPageChange(props.pageSelected+1)}
                className={`${styles.pageBox} ${props.pageSelected === props.pageCount && styles.inactive}`}>{props.nextSymbol}</div> 
            <div 
                onClick={() => props.onPageChange(props.pageCount)}
                className={`${styles.pageBox} ${props.pageSelected === props.pageCount && styles.inactive}`}>{props.nextSymbol}{props.nextSymbol}</div> 

        </div>
    );
}

export default Pagination;