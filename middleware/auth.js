
import cookieParser from 'cookie-parser'
import { UnauthenticatedError } from '../errors/index.js'
import jwt from "jsonwebtoken";

  const auth = async (req, res, next) => {
    // check header
    //const token = req.cookies.jwt
    const authHeader = req.headers.authorization

    if ( !authHeader ) {
      throw new UnauthenticatedError('Authentication invalid')
    }
    const tokenFromHeader = authHeader.split(' ')[1]
    
    console.log("Req.headers: " + tokenFromHeader)
    try {
      const payload = jwt.verify(tokenFromHeader, process.env.JWT_SECRET)
      console.log("UserId: " + payload.userId)
      req.user = { userId: payload.userId }
      next()
    } catch (error) {
      throw new UnauthenticatedError('Authentication invalid')
    }
  }
export default auth