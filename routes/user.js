import express from 'express'
import sql from 'mssql'
import poolConnect from '../sqlDatabase.js'
import { asyncMiddleware, verifyJWT } from '../utils/middleware.js'
import { encryptPasword, checkPassword } from '../utils/encryption.js'
import createAccessToken from '../utils/authentication.js'

const router = express.Router()

// test route
router.route('/test')
  .get(asyncMiddleware(async (req, res, next) => {
    poolConnect.then((pool) => {
      return pool.request()
        .query('SELECT * FROM Species')
    }).then(result => {
      console.log('result of query ', result)
      res.end('test route') 
    }).catch(err => {
      console.log('error is: ', err)
    })
  }))

// Create user account
router.route('/register')
  .post(asyncMiddleware(async (req, res, next) => {

    console.log('request object ', req.body)
    let parsedBody = req.body

    // TODO: check email is unique

    // encryption password
    const { salt, encryptedPass } = encryptPasword(parsedBody.password)
    parsedBody.salt = salt
    parsedBody.password = encryptedPass

    // save to database
    let createUserQuery = `INSERT INTO UserAccount (FullName, Email, UserPassword, Salt) VALUES ('${parsedBody.name}', '${parsedBody.email}', '${parsedBody.password}', '${parsedBody.salt}')`;
    console.log('createUserQuery ', createUserQuery)
    poolConnect.then(async (pool) => {
      const createUser = await pool.request().query(createUserQuery)
      console.log('createUser result ', createUser)
      let getUserQuery = `SELECT * FROM UserAccount WHERE Email='${parsedBody.email}'`;
      const getUser = await pool.request().query(getUserQuery)
      console.log('getUser result ', getUser)
      let user = getUser.recordset[0]
      return user
    }).then(user => {
      console.log('user result ', user)
      res.json({ error: null, data: 'Account created successfully' })
    }).catch(err => {
      console.log('error is: ', err)
      next(err)
    })
  }))

  // Login user
router.route('/login')
.post(asyncMiddleware(async (req, res, next) => {
  let parsedBody = req.body

  poolConnect.then(async (pool) => {
    const getUser = await pool.request().query(`SELECT * FROM UserAccount WHERE Email='${parsedBody.email}'`)
    let user = getUser.recordset[0]

    // check password
    let encryptedPass = user.UserPassword
    let salt = user.Salt
    if (checkPassword(parsedBody.password, encryptedPass, salt) !== true) {
      next(new Error('Wrong password').status(404))
    }

    // create access token for user
    let userId = user.Id
    const { token, tokenExpiryDate } = createAccessToken(userId)
    console.log('tokenExpiryDate ', tokenExpiryDate)
    let saveTokenQuery = `INSERT INTO UserToken (Token, TokenExpireDate, Usage, UserId) VALUES ('${token}', '${tokenExpiryDate}', '${1}', '${userId}')`
    const saveToken = await pool.request().query(saveTokenQuery)
    console.log('save token ', saveToken)
    console.log('token ', token)
    return token
  }).then(token => {
    console.log('token result ', token)
    res.header('authorization', token).json({ error: null, data: { token } })
  }).catch(err => {
    console.log('error is: ', err)
    next(err)
  })
}))

// Get user account information
router.route('/account/:userId')
  .get(verifyJWT, asyncMiddleware(async (req, res, next) => { 
    res.end('get account route')
  }))

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
