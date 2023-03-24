const fs = require('fs');
const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');

oracledb.autoCommit = true;

let database;

let libPath;
if (process.platform === 'win32') {           // Windows
  libPath = 'C:\\instantclient_21_9';
} 

if (libPath && fs.existsSync(libPath)) {
  oracledb.initOracleClient({ libDir: libPath });
}

async function initDatabase() {
  try {
    if(database) return
    database = await oracledb.getConnection(dbConfig);

    console.log('Connection was successful!');
  } 
  catch (err) {
    console.error(err);
  }
}

function getDatabase() {
  if(database) return database;
  return null;
}

module.exports = {
  initDatabase,
  getDatabase,
};
