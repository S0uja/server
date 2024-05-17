require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
var fs = require('fs')
const PORT = process.env.PORT || 5000
const app = express()
const morgan = require('morgan')
const expressWs = require('express-ws')
const logStream = fs.createWriteStream(path.join(__dirname, 'logs.log'), {
	flags: 'a',
})

const {
	messageUserHandler,
	messageAdminHandler,
} = require('./sockets/supportSocket')

expressWs(app)

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(morgan('common', { stream: logStream }))
app.ws('/support/user', messageUserHandler)
app.ws('/support/admin', messageAdminHandler)
app.use('/api', router)
app.use(errorHandler)

const start = async () => {
	try {
		await sequelize.authenticate()
		await sequelize.sync()
		app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
	} catch (e) {
		console.log(e)
	}
}

start()
