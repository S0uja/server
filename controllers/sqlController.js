const sendResponse = require('../utils/sendResponse')
const sequelize = require('../db.js')

class SqlController {
	async makeSql(req, res) {
		try {
			const { sql } = req.body

			let result
			try {
				result = await sequelize.query(sql, { raw: true })
			} catch (error) {
				return sendResponse(res, 400, 'error', { message: [error] })
			}

			return sendResponse(res, 200, 'success', { data: [result] })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
}

module.exports = new SqlController()
