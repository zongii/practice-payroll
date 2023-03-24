import React, { useEffect, useState } from 'react';

import styles from './App.module.css';
import * as tokenHandler from './modules/TokenHandler';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

  
import TitlePage from './components/pages/TitlePage';
import NavBar from './components/pages/NavBar';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Panel from './components/pages/Panel';
  

function App(props) {
    const [isLogged, setIsLogged] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState("Example User");
    const [buttonUpdate, setButtonUpdate] = useState(false);

    function buttonClick() {
        console.log("NAV BUTTON")
        setButtonUpdate(prev => !prev);
    }

    function verifyCredentials() {
        tokenHandler.verifyCredentials()
        .then(data => {
            if(data.status === "OK")
            {
                handleSetLogin(true)
                handleSetAdmin(data.isAdmin);
                handleUserName(data.user)
                return
            }
            handleSetLogin(false)

        })
    }
  
    useEffect(() => {
        verifyCredentials()    
    }, [])

    function handleUserName(name) {
        setUserName(name);
    }

    function handleSetLogin(state) {
        setIsLogged(state);
    }

    function handleSetAdmin(state) {
        setIsAdmin(state);
    }

    function logout() {
        tokenHandler.clearTokenData();
        setIsLogged(false);
        setIsAdmin(false);
        setUserName("Example User");
    }

    if(isLogged === null) return (<></>)

    return (
    <>
        <Router>
            {isLogged && <NavBar user={userName} logoutRef={logout} isAdmin={isAdmin} clickButton={buttonClick}/>}

            {!isLogged ? (
                <Routes>
                    <Route exact path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login setLogged={handleSetLogin} setAdmin={handleSetAdmin} setUser={handleUserName}/>} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            ) : ( !isAdmin ? (
                <Routes>
                    <Route exact path="/" element={<Navigate to="/panel" />} />
                    <Route path="/panel" element={<Panel logoutRef={logout}/>} />
                    <Route path="*" element={<Navigate to="/panel" />} />
                </Routes>
            ) : (
                <Routes>
                    <Route exact path="/" element={<Navigate to="/panel" />} />
                    <Route path="/admin" element={<Home button={buttonUpdate} />} />
                    <Route path="/panel" element={<Panel logoutRef={logout}/>} />
                    <Route path="*" element={<Navigate to="/panel" />} />
                </Routes>
            )
            )}
            
        </Router>
    </>
    );
}

export default App;