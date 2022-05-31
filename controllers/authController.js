import { StatusCodes } from 'http-status-codes'
import UserModel from '../models/User.js'
import { BadRequestError, UnauthenticatedError } from '../errors/index.js'






//Oluşan hatayı errorhandler a gönderebilmek için next içerisine errorü koy ondan sonra orada bakalım demek
//express async error import ettiğimiz için next kullanmaya gerek yok.


const createSendToken = (user, statusCode, res) => {

  const token = user.createJWT()
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name
    },
    token,
    location: user.location
  })
};


const register = async (req, res, next) => {

  const { name, password, email } = req.body
  console.log(`${req.body} geldi.`)
  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all values')
  }

  const user = await UserModel.create({ name, email, password })
  createSendToken(user, StatusCodes.CREATED, res)

}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide all values')
  }
  const user = await UserModel.findOne({ email }).select('+password')
  console.log("check user: " + user)

  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  user.password = undefined
  createSendToken(user, StatusCodes.OK, res)
}

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError('Please provide all values')
  }

  const user = await UserModel.findOne({ _id: req.user.userId })
  console.log("user value:" + user)
  user.email = email
  user.name = name
  user.lastName = lastName
  user.location = location

  await user.save()

  res.status(StatusCodes.OK).json({
    user,
    location: user.location,
  })
}

export { register, login, updateUser }