const {
	Order,
	OrderProducts,
	OrderStatus,
	Product,
	User,
	ProductImages,
} = require('../models/models')
const sendResponse = require('../utils/sendResponse')

class OrderController {
	async createUser(req, res) {
		try {
			const errors = []
			let { address, products, price } = req.body
			products = JSON.parse(products)
			const userId = req.user.id
			const filteredProducts = []

			for (const product of products) {
				if (await Product.findOne({ where: { id: product.id } })) {
					filteredProducts.push(product)
				}
			}
			if (!filteredProducts.length) {
				errors.push('Товары отсутствуют')
			}
			if (!address) {
				errors.push('Адрес не заполнен')
			}
			if (!price) {
				errors.push('Суммарная стоимость не заполнена')
			}
			if (!userId) {
				errors.push('Номер пользователя не заполнен')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			const order = await Order.create({
				userId: userId,
				address: address,
				price: price,
				orderStatusId: 1,
			})

			for (const product of filteredProducts) {
				await OrderProducts.create({
					orderId: order.id,
					productId: product.id,
					count: product.count,
				})
			}

			return sendResponse(res, 200, 'success', {
				data: [
					await Order.findOne({
						where: { id: order.id },
						include: [
							{
								model: OrderProducts,
								include: [{ model: Product, include: [ProductImages] }],
							},
							OrderStatus,
						],
					}),
				],
			})
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}

	async createAdmin(req, res) {
		try {
			const errors = []
			const { address, products, price, userId, orderStatusId } = req.body
			const filteredProducts = []

			for (const product of products) {
				const jsonProduct = JSON.parse(product)
				if (await Product.findOne({ where: { id: jsonProduct.id } })) {
					filteredProducts.push(jsonProduct)
				}
			}

			if (!filteredProducts.length) {
				errors.push('Товары отсутствуют')
			}
			if (!address) {
				errors.push('Адрес не заполнен')
			}
			if (!price) {
				errors.push('Суммарная стоимость не заполнена')
			}
			if (!userId) {
				errors.push('Номер пользователя не заполнен')
			}
			if (!orderStatusId) {
				errors.push('Статус заказа не указан')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			const order = await Order.create({
				userId: userId,
				address: address,
				price: price,
				orderStatusId: orderStatusId,
			})

			for (const product of filteredProducts) {
				await OrderProducts.create({
					orderId: order.id,
					productId: product.id,
					count: product.count,
				})
			}

			return sendResponse(res, 200, 'success', {
				data: [
					await Order.findOne({
						where: { id: order.id },
						include: [
							User,
							{
								model: OrderProducts,
								include: [Product],
								OrderStatus,
							},
						],
					}),
				],
			})
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}

	async getAllUser(req, res) {
		try {
			const errors = []
			const userId = req.user.id
			const orderList = await Order.findAll({
				where: { userId: userId },
				include: [
					{
						model: OrderProducts,
						include: [
							{
								model: Product,
								include: [ProductImages],
							},
						],
					},
					OrderStatus,
				],
				order: [['createdAt', 'DESC']],
			})

			if (!orderList) {
				errors.push('Заказы не найдены')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', { data: orderList })
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
			const errors = []
			const order = await Order.findOne({
				where: { id: id, userId: userId },
				include: [{ model: OrderProducts, include: [Product], OrderStatus }],
			})

			if (order.userId !== userId) {
				errors.push('Заказ не принадлежит вам')
			}
			if (!order) {
				errors.push('Заказ не найден')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', { data: [order] })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
	async getProductsForRate(req, res) {
		try {
			const userId = req.user.id
			const errors = []
			const products = await OrderProducts.findAll({
				include: [
					{
						model: Product,
						include: [ProductImages],
					},
					{
						model: Order,
						where: { userId: userId },
					},
				],
				where: { isRate: false },
			})

			// if (!products.length) {
			//     errors.push("Продукты без оценки не найдены");
			// }
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', { data: [products] })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}

	async getAllAdmin(req, res) {
		try {
			const errors = []
			const orderList = await Order.findAll({
				include: [
					User,
					OrderStatus,
					{ model: OrderProducts, include: [Product] },
				],
			})

			if (!orderList) {
				errors.push('Заказы не найдены')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', { data: orderList })
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
			const order = await Order.findOne({
				where: { id: id },
				include: [
					User,
					OrderStatus,
					{ model: OrderProducts, include: [Product] },
				],
			})

			if (!order) {
				errors.push('Заказ не найден')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', { data: [order] })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}

	async update(req, res) {
		try {
			const { id } = req.params
			const { address, products, price, orderStatusId, userId } = req.body
			const oldOrder = await Order.findOne({ where: { id: id } })
			const errors = []
			const filteredProducts = []

			for (const product of products) {
				const jsonProduct = JSON.parse(product)
				if (await Product.findOne({ where: { id: jsonProduct.id } })) {
					filteredProducts.push(jsonProduct)
				}
			}

			if (!filteredProducts.length) {
				errors.push('Товары отсутствуют')
			}
			if (!address) {
				errors.push('Адрес не заполнен')
			}
			if (!price) {
				errors.push('Суммарная стоимость не заполнена')
			}
			if (!userId) {
				errors.push('Номер пользователя не заполнен')
			}
			if (!orderStatusId) {
				errors.push('Номер статуса заказа не указан')
			}
			if (!oldOrder) {
				errors.push('Заказ не найден')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			await Order.update(
				{
					address: address,
					price: price,
					userId: userId,
					orderStatusId: orderStatusId,
				},
				{ where: { id: id } }
			)
			await OrderProducts.destroy({ where: { orderId: id } })
			for (const product of filteredProducts) {
				await OrderProducts.create({
					orderId: id,
					productId: product.id,
					count: product.count,
				})
			}

			return sendResponse(res, 200, 'success', {})
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}

	async delete(req, res) {
		try {
			const { id } = req.params
			const errors = []
			const order = await Order.findOne({ where: { id: id } })

			if (!order) {
				errors.push('Заказ не найден')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}
			await OrderProducts.destroy({ where: { orderId: id } })
			await Order.destroy({ where: { id: id } })

			return sendResponse(res, 200, 'success', {})
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
}

module.exports = new OrderController()
