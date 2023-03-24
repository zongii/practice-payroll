const express = require('express');
const oracledb = require('oracledb');
const db = require('../db/db');

const sha512 = require('js-sha512');
const tokenHandler = require('../modules/authtoken');
const { password } = require('../config');

const router = express.Router();

router.post('/signin', async(req, res) => {
    const data = req.body;

    const encoded = sha512(data.password);
    console.log(encoded)

    let sql = `SELECT * FROM ACCOUNTS WHERE LOGIN='${data.login}' AND PASSWORD='${encoded}'`
    let result = await db.getDatabase().execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    if (result.rows.length === 1) {
        const token = tokenHandler.generateToken(data.login, encoded);
        let isAdmin = result.rows[0].ISADMIN === 0 ? false : true;


        res.status(200).json({ status: 'OK', message: 'Logged in successfully', user: data.login, token: token, isAdmin: isAdmin });
        return;
    }
    res.status(400).json({ status: 'failed', message: 'Credentials are invalid' });

})

router.post('/verifytoken', async(req, res) => {
    const data = req.body;

    console.log("PRPRPRP")
    console.log(data)

    if (tokenHandler.verifyToken(data.token, data.user)) {
        const tokenData = tokenHandler.decodeToken(data.token);

        let sql = `SELECT * FROM ACCOUNTS WHERE LOGIN='${tokenData.user}' AND PASSWORD='${tokenData.password}'`
        let result = await db.getDatabase().execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });


        if(result.rows.length === 0) {
            res.status(400).json({ status: 'failed', message: 'Token invalid' });
            return
        }

        let isAdmin = result.rows[0].ISADMIN === 0 ? false : true;
        
        res.status(200).json({status: "OK", message: `Token valid for user ${data.user}`, user: data.user, isAdmin: isAdmin})
        return;
    }

    res.status(400).json({ status: 'failed', message: 'Token invalid' });

})

router.post('/create', async(req, res) => {
    const data = req.body;

    console.log(data.token)

    if (!tokenHandler.verifyToken(data.token, data.user)) {
        res.status(403).json({ status: "failed", message: "You are not permitted to perform this action" });
        return;
    } else {
        const tokenData = tokenHandler.decodeToken(data.token);

        let sql = `SELECT * FROM ACCOUNTS WHERE LOGIN='${tokenData.user}' AND PASSWORD='${tokenData.password}'`
        let result = await db.getDatabase().execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        let isAdmin = result.rows[0].ISADMIN === 0 ? false : true;
        if(!isAdmin) {
            res.status(403).json({ status: "failed", message: "You are not permitted to perform this action" });
            return;
        }
    }
    
    let sql = `SELECT COUNT(*) FROM ACCOUNTS WHERE WORKER_ID=${data.workerID}`
    let result = await db.getDatabase().execute(sql);

    if(result.rows[0][0] > 0) {
        res.status(400).json({ status: "failed", message: "This worker has an account already" });
        return;
    }

    sql = `SELECT COUNT(*) FROM ACCOUNTS WHERE LOGIN='${data.login}'`
    result = await db.getDatabase().execute(sql);

    if(result.rows[0][0] > 0) {
        res.status(400).json({ status: "failed", message: "Login taken" });
        return;
    }

    sql = `SELECT COUNT(*) FROM WORKERS WHERE ID=${data.workerID}`
    result = await db.getDatabase().execute(sql);

    if(result.rows[0][0] !== 1) {
        res.status(400).json({ status: "failed", message: "Worker with given ID doesn't exist" });
        return;
    }

    if (req.body.password.length < 8) {
        res.status(400).json({ status: "failed", message: "Password must be at least 8 chatacters long" });
        return;
    }

    const encodedPassword = sha512(data.password);

    sql = `INSERT INTO ACCOUNTS VALUES(-1, '${data.login}', '${encodedPassword}', '${data.mail ?? ""}', ${data.workerID}, 0)`

    try {
        result = await db.getDatabase().execute(sql);
        res.status(200).json({ status: "OK", message: "Registered successfully" })
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message })
    }
})

router.post('/modify', async(req, res) => {
    const data = req.body;

    console.log(data.token)

    if (!tokenHandler.verifyToken(data.token, data.user)) {
        res.status(403).json({ status: "failed", message: "You are not permitted to perform this action" });
        return;
    } else {
        const tokenData = tokenHandler.decodeToken(data.token);

        let sql = `SELECT * FROM ACCOUNTS WHERE LOGIN='${tokenData.user}' AND PASSWORD='${tokenData.password}'`
        let result = await db.getDatabase().execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        let isAdmin = result.rows[0].ISADMIN === 0 ? false : true;
        if(!isAdmin) {
            res.status(403).json({ status: "failed", message: "You are not permitted to perform this action" });
            return;
        }
    }
    
    let sql = `SELECT COUNT(*) FROM ACCOUNTS WHERE WORKER_ID=${data.workerID}`
    let result = await db.getDatabase().execute(sql);

    if(result.rows[0][0] < 1) {
        res.status(400).json({ status: "failed", message: "This worker doesn't have an account" });
        return;
    }

    sql = `SELECT COUNT(*) FROM WORKERS WHERE ID=${data.workerID}`
    result = await db.getDatabase().execute(sql);

    if(result.rows[0][0] !== 1) {
        res.status(400).json({ status: "failed", message: "Worker with given ID doesn't exist" });
        return;
    }

    if(data.login !== "") {
        sql = `SELECT COUNT(*) FROM ACCOUNTS WHERE LOGIN='${data.login}'`
        result = await db.getDatabase().execute(sql);
    
        if(result.rows[0][0] > 0) {
            res.status(400).json({ status: "failed", message: "Login taken" });
            return;
        }
    }

    if(data.password !== "") {
        if (req.body.password.length < 8) {
            res.status(400).json({ status: "failed", message: "Password must be at least 8 chatacters long" });
            return;
        }
    }

    let params = []

    if(data.login !== "")       params.push(`login='${data.login}'`)
    if(data.email !== "")       params.push(`mail='${data.email}'`)
    if(data.password !== "")    params.push(`password='${sha512(data.password)}'`)

    if(params.length === 0) {
        res.status(400).json({ status: "fail", message: "Nothing to change" })
        return
    }

    sql = `UPDATE ACCOUNTS SET ${params.join()} WHERE WORKER_ID=${data.workerID}`

    console.log(sql);

    try {
        result = await db.getDatabase().execute(sql);
        res.status(200).json({ status: "OK", message: "Updated successfully" })
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message })
    }
})

router.post('/delete', async (req, res) => {
    const body = req.body;

    if (!tokenHandler.verifyToken(body.token, body.user)) {
        res.status(403).json({ status: "failed", message: "You are not permitted to perform this action" });
        return;
    } else {
        const tokenData = tokenHandler.decodeToken(body.token);

        let sql = `SELECT * FROM ACCOUNTS WHERE LOGIN='${tokenData.user}' AND PASSWORD='${tokenData.password}'`
        let result = await db.getDatabase().execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        let isAdmin = result.rows[0].ISADMIN === 0 ? false : true;
        if(!isAdmin) {
            res.status(403).json({ status: "failed", message: "You are not permitted to perform this action" });
            return;
        }
    }

    console.log(`Delete ${body.workerID}`)

    if(isNaN(body.workerID)) {
        res.status(400).send({message: "Not a valid ID"});
    }

    const sql = `DELETE FROM ACCOUNTS WHERE WORKER_ID=${body.workerID}`;

    let test = await db.getDatabase().execute(sql);

    res.status(200).send({status: "OK", message: "Success"});
});

module.exports = router;