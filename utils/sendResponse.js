module.exports = (res, statusCode, statusText, { message = [], data = [] }) => {
	return res.status(statusCode).json({
		status: statusText,
		body: {
			message: message,
			data: data,
		},
	})
}
