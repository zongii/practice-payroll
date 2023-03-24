const express = require('express');

const oracledb = require('oracledb');
const db = require('../db/db');

const sha512 = require('js-sha512');
const tokenHandler = require('../modules/authtoken');
const { password } = require('../config');

const router = express.Router();

router.post('/me', async (req, res) => {
    const body = req.body;

    if (!tokenHandler.verifyToken(body.token, body.user)) {
        res.status(403).json({ status: "failed", message: "You are not permitted to perform this action" });
        return;
    }

    try {
        const tokenData = tokenHandler.decodeToken(body.token);

        let sql = `SELECT * FROM ACCOUNTS WHERE LOGIN='${tokenData.user}' AND PASSWORD='${tokenData.password}'`
        let accountData = await db.getDatabase().execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    
        let workerID = accountData.rows[0]["WORKER_ID"];
    
        sql = `SELECT * FROM WORKERS WHERE ID=${workerID}`
        let workerData = await db.getDatabase().execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    
        res.status(200).send({status: "OK", accountData:accountData.rows[0], workerData:workerData.rows[0]});
        return;
    }
    catch {
        res.status(400).json({ status: "failed", message: "Server error" });
        return;
    }
});

router.post('/modify', async(req, res) => {
    const data = req.body;

    console.log(data.token)

    if (!tokenHandler.verifyToken(data.token, data.user)) {
        res.status(403).json({ status: "failed", message: "You are not permitted to perform this action" });
        return;
    }

    const tokenData = tokenHandler.decodeToken(data.token);

    let sql = `SELECT * FROM ACCOUNTS WHERE LOGIN='${tokenData.user}' AND PASSWORD='${sha512(data.currentPassword)}'`
    let result = await db.getDatabase().execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });



    if(result.rows.length === 0) {
        res.status(403).json({ status: "failed", message: "Incorrect password" });
        return;
    }

    if(data.password !== "") {
        if (req.body.password.length < 8) {
            res.status(400).json({ status: "failed", message: "Password must be at least 8 chatacters long" });
            return;
        }
    }

    let params = []

    if(data.email !== "")       params.push(`mail='${data.email}'`)
    if(data.password !== "")    params.push(`password='${sha512(data.password)}'`)

    if(params.length === 0) {
        res.status(400).json({ status: "fail", message: "Nothing to change" })
        return
    }

    sql = `UPDATE ACCOUNTS SET ${params.join()} WHERE LOGIN='${tokenData.user}' AND PASSWORD='${sha512(data.currentPassword)}'`

    console.log(sql);

    try {
        result = await db.getDatabase().execute(sql);
        if(data.password !== "") {
            const token = tokenHandler.generateToken(data.login, sha512(data.password));
            res.status(200).json({ status: "OK", message: "Updated successfully", user: tokenData.user, token: token })
            return
        }
        res.status(200).json({ status: "OK", message: "Updated successfully", user: tokenData.user, token: data.token })
        return
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message })
    }
})

module.exports = router;
