import express from 'express'

const router = express.Router()

// Home page
router.get('/', function(req, res) {
  res.end('test')
})

export default router
