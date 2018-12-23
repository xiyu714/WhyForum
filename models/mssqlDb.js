const mssql = require('mssql');
const config = {
  user: 'sa',
  password: 'xiyu',
  server: 'localhost',
  database: 'forum',
  port: 1443
}
exports.poolPromise = mssql.connect(config);
exports.mssql = mssql;
