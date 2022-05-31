
const NotFoundMiddleware = (req, res) => {
    res.status(404).send('Route doesnot exist')
}
export default NotFoundMiddleware