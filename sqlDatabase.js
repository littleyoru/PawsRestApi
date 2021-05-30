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
    encrypt: true,
    trustServerCertificate: true // change to false for production
  }
}

const dbConnect = (req, res, next) => { 
  sql.connect(sqlConfig).then(() => {
    return sql.query`SELECT * FROM Species`
  }).then(result => {
    console.dir(result)
    next()
  }).catch(err => {
    // error checks
    console.log('error ', err)
    next(err)
  })
  next()
}

sql.on('error', err => {
  // error handler
  console.log('error handler ', err)
})

dbConnect()

export default sql
