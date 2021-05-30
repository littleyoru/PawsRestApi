import express from 'express'
import sql from 'mssql'

const router = express.Router()

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

const pool = new sql.ConnectionPool(sqlConfig)

// Login user
router.route('/login')
  .post((req, res) => {
    // test db connection
    pool.connect(sqlConfig).then(() => {
      console.log('here')
      //return sql.query`SELECT * FROM Species`
      return pool.query('SELECT * FROM Species')
    }).then(result => {
      console.dir(result)
      console.log(result)
      return pool.close()
    }).catch(err => {
      // error checks
      console.log('error ', err)
      return pool.close()
    })
    pool.on('error', err => {
      // error handler
      console.log('error handler ', err)
      pool.close()
    })

    res.end('login route') 
  })

// Create user account
router.route('/register')
  .post((req, res) => { res.end('register route') })

// Get user account information
router.route('/account/:userId')
  .get((req, res) => { res.end('get account route') })

// Update user account information
router.route('/account')
  .post((req, res) => { res.end('update account route') })

// Confirm user account with 'activation code' sent by email/sms
router.route('/confirm/:code')
  .post((req, res) => { res.end('confirm user route') })

// Resend activation code
router.route('/confirm/resend/:userId')
  .post((req, res) => { res.end('resend confirm code route') })

// Reset password using token sent by email/sms
router.route('/reset/:token')
  .post((req, res) => { res.end('reset password route') })


export default router;
