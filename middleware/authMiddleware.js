const jwt = require('jsonwebtoken')
const sendResponse = require('../utils/sendResponse')

module.exports = function (req, res, next) {
	if (req.method === 'OPTIONS') {
		next()
	}
	try {
		const token = req.headers.authorization.split(' ')[1]
		if (!token) {
			return sendResponse(res, 200, 'error', { message: ['Не авторизован'] })
		}
		const info = jwt.verify(token, process.env.SECRET_KEY)
		req.user = info
		next()
	} catch (e) {
		return sendResponse(res, 200, 'error', { message: ['Не авторизован'] })
	}
}
