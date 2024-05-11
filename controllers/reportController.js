const {
	Order,
	OrderProducts,
	OrderStatus,
	Product,
	User,
} = require('../models/models')
const sendResponse = require('../utils/sendResponse')
const sequelize = require('sequelize')
const excelJS = require('exceljs')

class ReportController {
	async profit(req, res) {
		try {
			const { startDate, endDate } = req.query

			const orders = await Order.findAll({
				include: [OrderStatus],
				where: {
					createdAt: {
						[sequelize.Op.between]: [startDate, endDate],
					},
				},
			})

			console.log(orders)

			const workbook = new excelJS.Workbook()
			const worksheet = workbook.addWorksheet('Orders')

			worksheet.addRow(['ID', 'Address', 'Price', 'Date', 'Status'])

			orders.forEach(order => {
				worksheet.addRow([
					order.id,
					order.address,
					order.price,
					order.order_status?.name,
				])
			})

			const filePath = 'orders.xls'
			await workbook.xlsx.writeFile(filePath)

			res.sendFile(
				filePath,
				{
					root: process.cwd(),
					useSharedStrings: true,
					useStyles: true,
					encoding: 'utf8',
				},
				err => {
					if (err) {
						throw new Error('Ошибка при отправке файла')
					} else {
						console.log('Файл успешно отправлен')
					}
				}
			)
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
	async newUsers(req, res) {
		try {
			const [startDate, endDate] = req.params

			const users = await User.findAll({
				where: {
					createdAt: {
						[sequelize.Op.between]: [startDate, endDate],
					},
				},
			})

			return sendResponse(res, 200, 'success', {
				data: [users],
			})
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
	async popularProducts(req, res) {
		try {
			const [startDate, endDate] = req.params

			const popularProducts = await OrderProducts.findAll({
				attributes: [
					'productId',
					[sequelize.fn('count', sequelize.col('productId')), 'total'],
				],
				include: [
					{
						model: Order,
						where: {
							createdAt: {
								[sequelize.Op.between]: [startDate, endDate],
							},
						},
					},
				],
				group: ['productId'],
				order: [[sequelize.literal('total'), 'DESC']],
				limit: 150, // Можно указать нужное количество популярных товаров
			})

			return sendResponse(res, 200, 'success', {
				data: [popularProducts],
			})
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
}

module.exports = new ReportController()
