import express from 'express'
import sql from 'mssql'
// import poolPromise from '../sqlDatabase.js'
import poolConnect from '../sqlDatabase.js'

const router = express.Router()

// test route
router.route('/test')
  .get((req, res, next) => {
    // await poolConnect
    // try {
    //   // const request = poolPromise.request()
    //   // const request = new sql.Request(poolPromise)
    //   const result = await poolConnect.request()
    //     // .input('input_parameter', sql.Int, req.query.input_parameter)
    //     // .query('select * from mytable where id = @input_parameter')
    //     .query('SELECT * FROM Species')
    //   res.json(result.recordset)
    // } catch (err) {
    //   next(err)
    //   res.status(500)
    //   res.end(err.message)
    // }

    poolConnect.then((pool) => {
      return pool.request()
        .query('SELECT * FROM Species')
    }).then(result => {
      console.log('result ', result)
    }).catch(err => {
      console.log('error is: ', err)
    })

    // test db connection
    // pool.connect(sqlConfig).then(() => {
    //   console.log('here')
    //   //return sql.query`SELECT * FROM Species`
    //   return pool.query('SELECT * FROM Species')
    // }).then(result => {
    //   console.dir(result)
    //   console.log(result)
    //   return pool.close()
    // }).catch(err => {
    //   // error checks
    //   console.log('error ', err)
    //   return pool.close()
    // })
    // pool.on('error', err => {
    //   // error handler
    //   console.log('error handler ', err)
    //   pool.close()
    // })

    res.end('login route') 
  })

// Login user
router.route('/login')
  .post((req, res, next) => {
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
