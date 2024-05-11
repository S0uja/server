module.exports = (res, statusCode, statusText, { message = [], data = [] }) => {
	console.log(statusCode, statusText, message)
	return res.status(statusCode).json({
		status: statusText,
		body: {
			message: message,
			data: data,
		},
	})
}
