import crypto from 'crypto'

export const encryptPasword = (pass) => {
  let salt = crypto.randomBytes(16).toString('hex')
  let encryptedPass = crypto.createHmac('sha256', salt).update(pass).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  return { salt, encryptedPass }
}

export const checkPassword = (pass, encryptedPass, salt) => {
  let encrypted = crypto.createHmac('sha256', salt).update(pass).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  return encrypted === encryptedPass
}
