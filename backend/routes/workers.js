const express = require('express');
const oracledb = require('oracledb');
const tokenHandler = require('../modules/authtoken');
const router = express.Router();

const db = require('../db/db');

router.post('/list/count', async (req, res) => {
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

    let filterString = `'${body.filterColumn.toLowerCase()}'`
    if(!isNaN(parseInt(body.filterValueFrom))) {
        
        filterString += `, ${parseInt(body.filterValueFrom)}`;
        if(!isNaN(parseInt(body.filterValueTo))) {
            filterString += `, ${parseInt(body.filterValueTo)}`;
        }
    }

    if(body.filterColumn == 'null') {
        filterString = ''
    }

    const sql = `SELECT COUNT(*) FROM table(PLACE.DAJ_LISTE_PLAC(${filterString}))`

    const result = await db.getDatabase().execute(sql);

    res.send(result.rows);
});

router.post('/list/:id', async (req, res) => {
    const pageID = req.params.id;
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

    let filterString = `'${body.filterColumn.toLowerCase()}'`
    if(!isNaN(parseInt(body.filterValueFrom))) {
        
        filterString += `, ${parseInt(body.filterValueFrom)}`;
        if(!isNaN(parseInt(body.filterValueTo))) {
            filterString += `, ${parseInt(body.filterValueTo)}`;
        }
    }

    if(body.filterColumn == 'null') {
        filterString = ''
    }

    const sql = `SELECT * FROM
                (
                    SELECT a.*, rownum r__
                    FROM
                    (
                        SELECT * FROM table(PLACE.DAJ_LISTE_PLAC(${filterString}))
                    ) a
                    WHERE rownum < ((${pageID} * 20) + 1 )
                )
                WHERE r__ >= (((${pageID}-1) * 20) + 1)`;

    const result = await db.getDatabase().execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.send(result.rows);
});

router.post('/byid', async (req, res) => {
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

    const sql = `SELECT * FROM ACCOUNTS WHERE WORKER_ID=${body.workerID}`

    const result = await db.getDatabase().execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    console.log(result);

    res.send({status: "OK", count:result.rows.length, rows:result.rows});
});

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

    console.log(`Delete ${body.id}`)

    if(isNaN(body.id)) {
        res.status(400).send({message: "Not a valid ID"});
    }

    let sql = `DELETE FROM WORKERS WHERE id=${body.id}`;
    let test = await db.getDatabase().execute(sql);

    sql = `DELETE FROM ACCOUNTS WHERE WORKER_ID=${body.id}`;
    test = await db.getDatabase().execute(sql);

    res.status(200).send({message: "Success"});
});

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
    
    if(data.name === "") {

    }

    if(data.name === "") {
        res.status(400).json({ status: "fail", message: "Name not specified" })
        return
    }

    if(data.surname === "") {
        res.status(400).json({ status: "fail", message: "Surname not specified" })
        return
    }

    if(data.sallary <= 0 || data.sallary > 1000000) {
        res.status(400).json({ status: "fail", message: "Sallary should be between 1 and 1000000" })
        return
    }

    let sql = `CALL PLACE.DODAJ_PRACOWNIKA('${data.name}', '${data.surname}', ${data.sallary})`

    try {
        let result = await db.getDatabase().execute(sql);
        res.status(200).json({ status: "OK", message: "Registered successfully" })
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message })
    }
})

module.exports = router;
