const jwt = require('jsonwebtoken')
const fs = require('fs')

module.exports = (req, res, next) => {
	res.on('finish', () => {
		const token = req.headers.authorization
		if (token) {
			try {
				const info = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY)
				req.user = info
			} catch (e) {}
		}

		const logData = `${new Date().toISOString()}|${req?.user?.id || 'GUEST'}|${
			req?.user?.role || 'none'
		}|${req?.method}|'${req?._parsedOriginalUrl?.path}'|${req?.ip}\n`

		fs.appendFile('../logs.log', logData, err => {
			if (err) {
				console.error('Ошибка при записи в лог файл:', err)
			}
		})
	})

	next()
}
