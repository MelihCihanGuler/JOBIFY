import express from 'express'
const app = express()
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan'


import connectDB from './db/connect.js'
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'

//middleware
import errorHandlerMiddleware from './middleware/error-handler.js'
import NotFoundMiddleware from './middleware/not-found.js'
import authenticateUser from './middleware/auth.js'

app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Welcome!')
    console.log('Cookie JWT: ', req.cookies.jwt)
})

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.use(NotFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.port || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => console.log(`Server is listening on port ${port}...`))
    } catch (error) {
        console.log(`MongoError`)
    }   
}

start()