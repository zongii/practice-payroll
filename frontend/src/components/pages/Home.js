import React, { useEffect, useRef, useState } from 'react';
import * as tokenHandler from '../../modules/TokenHandler';

import styles from './Home.module.css'

import WorkersList from '../reusable/WorkersList';
import Pagination from '../reusable/Pagination';
import Filters from '../reusable/Filters';
import WorkerCard from '../reusable/WorkerCard';
import PopupModal from '../reusable/PopupModal';
import CreateAccount from '../reusable/CreateAccount';
import CreateWorker from '../reusable/CreateWorker';

import Container from 'react-bootstrap/Container';

function Home(props) {

    const isMounted = useRef(false);


    const [workersList, setWorkersList] = useState(null);
    const [updateTracker, setUpdateTracker] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [accountModalState, setAccountModalState] = useState(false);
    const [popupClickAction, setPopupClickAction] = useState(false);
    const [workerModalState, setWorkerModalState] = useState(false);
    const [addWorkerClick, setAddWorkerClick] = useState(false);


    const [filterData, setFilterData] = useState({
        filterColumn: 'null',
        filterValueFrom: '',
        filterValueTo: ''
    })

    

    function handleChange(event) {
        const target = event.currentTarget;

        if(target.name) {
            setFilterData(prevState => {
                console.log(prevState)
                return ({
                    ...prevState,
                    [target.name]: target.value
                })
            })
        }
    }

    useEffect(() => {
        const userData = tokenHandler.getTokenData();

        fetch(`http://localhost:2137/workers/list/count`, 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...filterData, user: userData.user, token: userData.token})
        })
        .then(response => response.json())
        .then(res => {
            console.log(res[0][0]);
            setPageCount(Math.ceil(res[0][0]/20));
        })
    }, [])

    useEffect(() => {
        const userData = tokenHandler.getTokenData();
        fetch(`http://localhost:2137/workers/list/count`, 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...filterData, user: userData.user, token: userData.token})
        })
        .then(response => response.json())
        .then(res => {
            setPageCount(prev => {
                let max = Math.ceil(res[0][0]/20);
                if(currentPage > max) setCurrentPage(max);
                return max;
            });
        })

        fetch(`http://localhost:2137/workers/list/${currentPage}`, 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...filterData, user: userData.user, token: userData.token})
        }).then(response => response.json())
        .then(data => {
            setWorkersList(data);
        })
    }, [currentPage, updateTracker])

    function handleDelete(workerid) {
        const userData = tokenHandler.getTokenData();

        fetch(`http://localhost:2137/workers/delete`, 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: workerid, user: userData.user, token: userData.token})
        })
        .then(response => {
            if(response.status === 200) {
                setUpdateTracker(prev => !prev);
                handleWorkerSelect(null);
            }

        })
    }

    useEffect(() => {
        if (isMounted.current) {
            handleWorkerState(true);
          } else {
            isMounted.current = true;
          } 
    }, [props.button])

    function handlePageToggle(pageNumber) {
        setCurrentPage(pageNumber);
    }

    function handleWorkerSelect(worker) {
        setSelectedWorker(worker);
    }

    function refreshWorkerSelect() {
        console.log("REFRESH");
        setSelectedWorker(prev => {return {...prev}});
    }

    function handleFiltersApply() {
        setUpdateTracker(prev => !prev);
    }

    function handleModalState(state) {
        setAccountModalState(state);
    }

    function handleModalAction() {
        setPopupClickAction(prev => !prev);
    }

    function handleWorkerState(state) {
        setWorkerModalState(state);
    }

    function handleWorkerAction() {
        setAddWorkerClick(prev => !prev);
    }

    return (
        <Container className={styles.mainContainer}>
            <PopupModal
                active={accountModalState}
                title={"Utwórz konto pracownika"}
                action={handleModalAction}
                close={() => handleModalState(false)}
            >
                <CreateAccount 
                    closeModal={() => handleModalState(false)}
                    clickToggle={popupClickAction}
                    workerData={selectedWorker} 
                    refresh={refreshWorkerSelect}
                />
            </PopupModal>

            <PopupModal
                active={workerModalState}
                title={"Dodaj nowego pracownika"}
                action={handleWorkerAction}
                close={() => handleWorkerState(false)}
            >
                <CreateWorker
                    closeModal={() => handleWorkerState(false)}
                    clickToggle={addWorkerClick}
                    refresh={handleFiltersApply}
                />
            </PopupModal>
            <div className={styles.verticalWrap}>
                <div className={styles.workerCard}>
                    <WorkerCard 
                        workerData={selectedWorker}
                        deleteRef={handleDelete}
                        openModal={() => handleModalState(true)}
                        refresh={refreshWorkerSelect}
                    />
                </div>
                <div className={styles.filtersCard}>
                    <h2>Filtry</h2>
                    <Filters 
                        list={workersList}
                        updateRef={handleChange}
                        applyRef={handleFiltersApply}
                    />
                </div>
            </div>
            
            <div className={styles.workersList}>
                <WorkersList 
                    list={workersList} 
                    selectRef={handleWorkerSelect}    
                />
                <div className={styles.pagination}>
                    <Pagination
                        nextSymbol=">"
                        prevSymbol="<"

                        onPageChange={handlePageToggle}
                        pageCount={pageCount}
                        pageSelected={currentPage}
                    />
                </div>
                
            </div>
        </Container>
    );
}

export default Home;