import sql from 'mssql'

const sqlConfig = {
  user: 'sa',
  password: 'M1racl3R0manc3.',
  server: 'DESKTOP-HMVT74S\\SQLEXPRESS', // DESKTOP-HMVT74S\SQLEXPRESS, 127.0.0.1\\sql
  database: 'Paws1',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    //instanceName: 'SQLEXPRESS',
    // encrypt: true,
    trustServerCertificate: true // change to false for production
  }
}

// const poolPromise = new sql.ConnectionPool(sqlConfig)
// const poolConnect = () => {
//   return poolPromise.connect()
// }
// const poolConnect = poolPromise.connect()
  // .then(pool => {
  //   console.log('Connected to database.')
  //   console.log('pool ', pool)
  //   return pool
  // })
  // .catch(err => {
  //   console.log('Failed to connect to database! ', err)
  //   next(err)
  // })

//   poolPromise.on('error', err => {
//   // error handler
//   console.log('error handler ', err)
// })

const poolConnect = new sql.ConnectionPool(sqlConfig).connect()
  .then(pool => { return pool })
  .catch(err => { console.log('error in connection to db ', err) })



export default poolConnect
