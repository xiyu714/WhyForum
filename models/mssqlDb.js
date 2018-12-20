const mssql = require('mssql');
const config = {
  user: 'sa',
  password: 'xiyu',
  server: 'localhost',
  database: 'luntan',
  port: 1443
}
exports.poolPromise = mssql.connect(config);
exports.mssql = mssql;
