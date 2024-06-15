const { Review, Product, User, OrderProducts } = require('../models/models')
const sendResponse = require('../utils/sendResponse')

class ReviewController {
	async createAdmin(req, res) {
		try {
			const { productId, text, rate, userId } = req.body
			const errors = []

			if (!productId) {
				errors.push('Номер товара не заполнен')
			}
			if (!text) {
				errors.push('Текст не заполнен')
			}
			if (!rate) {
				errors.push('Оценка не заполнена')
			}
			if (!userId) {
				errors.push('Номер пользователя не заполнен')
			}
			if (errors.length) {
				return sendResponse(res, 400, 'error', { message: errors })
			}

			await Review.create({
				productId: productId,
				text: text,
				rate: rate,
				userId: userId,
			})

			return sendResponse(res, 200, 'success', {
				data: [
					await Review.findOne({
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
	async createUser(req, res) {
		try {
			const { productId, text, rate, orderProductId } = req.body
			const userId = req.user.id
			const errors = []

			if (!productId) {
				errors.push('Номер товара не заполнен')
			}
			if (!text) {
				errors.push('Текст не заполнен')
			}
			if (!rate) {
				errors.push('Оценка не заполнена')
			}
			if (errors.length) {
				return sendResponse(res, 400, 'error', { message: errors })
			}

			const result = await Review.create({
				productId: productId,
				text: text,
				rate: rate,
				userId: userId,
			})
			await OrderProducts.update(
				{ isRate: true },
				{ where: { id: orderProductId } }
			)

			return sendResponse(res, 200, 'success', {
				data: [
					await Review.findOne({
						where: { id: result.id },
						include: [Product],
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
			const result = await Review.findAll({ include: [Product, User] })
			const errors = []

			if (!result) {
				errors.push('Отзывы не найдены')
			}
			if (errors.length) {
				return sendResponse(res, 400, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', { data: result })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
	async getOneAdmin(req, res) {
		try {
			const { id } = req.params
			const result = await Review.findAll({
				where: { id: id },
				include: [Product, User],
			})
			const errors = []

			if (!result) {
				errors.push('Отзыв не найден')
			}
			if (errors.length) {
				return sendResponse(res, 400, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', { data: [result] })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
	async getAllUser(req, res) {
		try {
			const userId = req.user.id
			const result = await Review.findAll({
				where: { userId: userId },
				include: [Product],
			})
			const errors = []

			if (!result) {
				errors.push('Отзывы не найдены')
			}
			if (errors.length) {
				return sendResponse(res, 400, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', { data: result })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
	async getOneUser(req, res) {
		try {
			const { id } = req.params
			const userId = req.user.id
			const result = await Review.findOne({
				where: { userId: userId, id: id },
				include: [Product],
			})
			const errors = []

			if (result.userId !== userId) {
				errors.push('Отзыв не принадлежит вам')
			}
			if (!result) {
				errors.push('Отзыв не найден')
			}
			if (errors.length) {
				return sendResponse(res, 400, 'error', { message: errors })
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
			const { productId, text, rate, userId } = req.body
			const errors = []
			const review = await Review.findOne({ where: { id: id } })

			if (!review) {
				errors.push('Отзыв не заполнен')
			}
			if (!productId) {
				errors.push('Продукт не заполнен')
			}
			if (!text) {
				errors.push('Текс не заполнен')
			}
			if (!rate) {
				errors.push('Оценка не заполнена')
			}
			if (!userId) {
				errors.push('Пользователь не указан')
			}
			if (errors.length) {
				return sendResponse(res, 400, 'error', { message: errors })
			}

			await Review.update(
				{
					userId: userId,
					productId: productId,
					text: text,
					rate: rate,
				},
				{ where: { id: id } }
			)

			return sendResponse(res, 200, 'success', {
				data: [
					await Review.findOne({
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
	async updateUser(req, res) {
		try {
			const { id } = req.params
			const { text, rate } = req.body
			const userId = req.user.id
			const review = await Review.findOne({
				where: { id: id, userId: userId },
			})
			const errors = []

			if (review.userId !== userId) {
				errors.push('Отзыв не принадлежит вам')
			}
			if (!review) {
				errors.push('Отзыв не найден')
			}
			if (!text) {
				errors.push('Текст не заполнен')
			}
			if (!rate) {
				errors.push('Оценка не заполнена')
			}
			if (errors.length) {
				return sendResponse(res, 400, 'error', { message: errors })
			}

			await Review.update(
				{ text: text, rate: rate },
				{ where: { id: id, userId: userId } }
			)

			return sendResponse(res, 200, 'success', {
				data: [
					await Review.findOne({
						where: { id: id, userId: userId },
						include: [Product],
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
			const result = await Review.destroy({ where: { id: id } })
			const errors = []

			if (!result) {
				errors.push('Отзыв не найден')
			}
			if (errors.length) {
				return sendResponse(res, 400, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success')
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
	async deleteUser(req, res) {
		try {
			const { id } = req.params
			const userId = req.user.id
			const result = await Review.destroy({
				where: { id: id, userId: userId },
			})
			const errors = []

			if (!result) {
				errors.push('Отзыв не найден')
			}
			if (errors.length) {
				return sendResponse(res, 400, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success')
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
}

module.exports = new ReviewController()
