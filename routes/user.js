import express from 'express'

const router = express.Router()

// Login user
router.route('/login')
  .post((req, res) => { res.end('login route') })

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
