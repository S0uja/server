const { Role, RolePermission, Permission } = require('../models/models')
const roles = Role.findAll({
	include: [{ model: RolePermission, include: [Permission] }],
})(
	(module.exports = function (req, res, next) {
		if (req.method === 'OPTIONS') {
			next()
		}
		try {
			console.log(roles)
			next()
		} catch (e) {
			return sendResponse(res, 200, 'error', { message: ['Не авторизован'] })
		}
	})
)
