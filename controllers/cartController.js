const { Cart, Product, User } = require('../models/models')
const sendResponse = require('../utils/sendResponse')

class CartController {
	async createUser(req, res) {
		try {
			const { json } = req.body
			const userId = req.user.id
			const cart = await Cart.findOne({ where: { userId: userId } })

			if (cart) {
				await Cart.update(
					{
						userId: userId,
						json: json,
					},
					{
						where: { id: cart.id },
					}
				)
			} else {
				await Cart.create({
					userId: userId,
					json: json,
				})
			}

			return sendResponse(res, 200, 'success', { data: [] })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
	async getUser(req, res) {
		try {
			const userId = req.user.id
			const result = await Cart.findOne({
				where: { userId: userId },
			})

			return sendResponse(res, 200, 'succes', { data: [result] })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}

	async createAdmin(req, res) {
		try {
			const { productId, count, userId } = req.body
			const errors = []

			if (!productId) {
				errors.push('Код товара не указан')
			}
			if (!userId) {
				errors.push('Код пользователя не указан')
			}
			if (!count) {
				errors.push('Количество товара не указано')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			const result = await Cart.create({
				userId: userId,
				productId: productId,
				count: count,
			})

			return sendResponse(res, 200, 'success', {
				data: [
					await Cart.findOne({
						where: { id: result.id },
						include: [Product, User],
					}),
				],
			})
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
	async getAllAdmin(req, res) {
		try {
			const errors = []

			const result = await Cart.findAll({ include: [Product, User] })

			if (!result) {
				errors.push('Записи в корзине не найдены')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', '', { data: result })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
	async getOneAdmin(req, res) {
		try {
			const { id } = req.params
			const errors = []
			const result = await Cart.findOne({
				where: { id: id },
				include: [User, Product],
			})

			if (!result) {
				errors.push('Запись в корзине не найдена')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', { data: [result] })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
	async updateAdmin(req, res) {
		try {
			const { id } = req.params
			const oldCart = await Cart.findOne({ where: { id: id } })
			const { productId, count, userId } = req.body
			const errors = []

			if (!oldCart) {
				errors.push('Запись в корзине не найдена')
			}
			if (!productId) {
				errors.push('Код товара не указан')
			}
			if (!count) {
				errors.push('Количество товара не указано')
			}
			if (!userId) {
				errors.push('Код пользователя не указан')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			await Cart.update(
				{ productId: productId, count: count, userId: userId },
				{ where: { id: id } }
			)

			return sendResponse(res, 200, 'success', {
				data: [
					await Cart.findOne({
						where: { id: id },
						include: [Product, User],
					}),
				],
			})
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
	async deleteAdmin(req, res) {
		try {
			const { id } = req.params
			const cart = await Cart.findOne({ where: { id: id } })
			const errors = []

			if (!cart) {
				errors.push('Запись в корзине не найдена')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			await Cart.destroy({ where: { id: id } })

			return sendResponse(res, 200, 'success')
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
}

module.exports = new CartController()
