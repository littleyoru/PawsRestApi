import dotenv from 'dotenv'

// wrapper for express route handlers
export const asyncMiddleware = fn => 
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  }

// verify JWT token
export const verifyJWT = (req, res, next) => {
  try {
    let jwtSecret = `${process.env.JWT_SECRET}`
    console.log('jwt secret ', jwtSecret)
    const { authorization } = req.headers
    if (!authorization) throw new Error('You must send an Authorization header')
    const [authType, token] = authorization.trim().split(' ')
    if (authType !== 'Bearer') throw new Error('Expected a Bearer token')
    const decoded = jwt.verify(token, jwtSecret)
    req.userId = decoded.id
    next()
  } catch(err) {
    next(err)
    // res.status(403).json({ Error: 'Invalid token' })
  }
}

// export default { asyncMiddleware, verifyJWT };
