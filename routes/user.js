import express from 'express'
import sql from 'mssql'
import crypto from 'crypto'
import poolConnect from '../sqlDatabase.js'
import { asyncMiddleware, verifyJWT } from '../utils/middleware.js'
import createAccessToken from '../utils/authentication.js'

const router = express.Router()

// test route
router.route('/test')
  .get(asyncMiddleware(async (req, res, next) => {
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
      console.log('result of query ', result)
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

    res.end('test route') 
  }))

// Create user account
router.route('/register')
  .post(asyncMiddleware(async (req, res, next) => {

    console.log('request object ', req.body)
    let parsedBody = req.body

    // TODO: check email is unique

    // encryption
    let salt = crypto.randomBytes(16).toString('hex')
    let hash = crypto.createHmac('sha256', salt).update(parsedBody.password).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    parsedBody.salt = salt
    parsedBody.password = hash

    // save to database
    let createUserQuery = `INSERT INTO UserAccount (FullName, Email, UserPassword, Salt) VALUES ('${parsedBody.name}', '${parsedBody.email}', '${parsedBody.password}', '${parsedBody.salt}')`;
    console.log('createUserQuery ', createUserQuery)
    poolConnect.then(async (pool) => {
      const createUser = await pool.request().query(createUserQuery)
      console.log('createUser result ', createUser)
      let getUserQuery = `SELECT * FROM UserAccount WHERE Email='${parsedBody.email}'`;
      const getUser = await pool.request().query(getUserQuery)
      console.log('getUser result ', getUser)
      let userId = getUser.recordset[0].Id
      console.log('current user id ', userId)
      // create access token for user
      const { token, tokenExpiryDate } = createAccessToken(userId)
      console.log('tokenExpiryDate ', tokenExpiryDate)
      let saveTokenQuery = `INSERT INTO UserToken (Token, Usage, UserId) VALUES ('${token}', '${1}', '${userId}')`
      const saveToken = await pool.request().query(saveTokenQuery)
      console.log('save token ', saveToken)
      console.log('token ', token)
      return token
    }).then(token => {
      console.log('token result ', token)
      res.header('authorization', token).json({ error: null, data: { token } })
      // res.json(req.body)
      // console.log('res after sending ', res)
    }).catch(err => {
      console.log('error is: ', err)
    })

    // res.end('register route')
  }))

  // Login user
router.route('/login')
.post(verifyJWT, async (req, res, next) => {

  // poolConnect.then((pool) => {
  //   return pool.request()
  //     .query('SELECT * FROM Species')
  // }).then(result => {
  //   console.log('result ', result)
  // }).catch(err => {
  //   console.log('error is: ', err)
  // })
  res.end('login route') 
})

// Get user account information
router.route('/account/:userId')
  .get((req, res) => { 
    // const { authorization } = req.headers
    // if (!authorization) throw new Error('You must send an Authorization header')
    // const [authType, token] = authorization.trim().split(' ')
    // if (authType !== 'Bearer') throw new Error('Expected a Bearer token')
    res.end('get account route')
  })

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
