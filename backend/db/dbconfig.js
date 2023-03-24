module.exports = {
    user          : process.env.NODE_ORACLEDB_USER || "SYSTEM",
    password      : process.env.NODE_ORACLEDB_PASSWORD || "2137",
    connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "localhost/XE",
    externalAuth  : false
}