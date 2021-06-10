import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

const createAccessToken = (userId) => {
  let jwtSecret = `${process.env.JWT_SECRET}`
  // let currentDate = new Date.now()
  // let saltString = currentDate.getFullYear().toString()
  // saltString += ('0' + currentDate.getHours().toString()).slice(-2)
  // saltString += ('0' + currentDate.getDate().toString()).slice(-2)
  // saltString += ('0' + (currentDate.getMonth()+1).toString()).slice(-2)
  // saltString += ('0' + currentDate.getSeconds().toString()).slice(-2)
  // let tokenSalt = crypto.createHash('sha1').update(saltString).digest('hex')
  // console.log('tokenSalt ', tokenSalt)
  // let secretSalt = tokenSalt.slice(0, 5) + jwtSecret + tokenSalt.slice(5)
  let tokenExpiryDate = new Date()
  tokenExpiryDate.setDate(tokenExpiryDate.getDate() + 1)
  tokenExpiryDate = tokenExpiryDate.toISOString().slice(0, 19).replace('T', ' ')
  let token = jwt.sign({userId: userId}, jwtSecret, {expiresIn: '24h'})
  return { token, tokenExpiryDate }
}

export default createAccessToken;
