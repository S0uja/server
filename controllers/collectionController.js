const sendResponse = require('../utils/sendResponse')
const deleteImages = require('../utils/deleteImages')
const {
	Collection,
	CollectionProducts,
	Product,
	Manufacturer,
	Category,
	ProductImages,
} = require('../models/models')

class CollectionController {
	async create(req, res) {
		try {
			const errors = []
			const { name, products, visible } = req.body
			const fileName = req.file?.filename || null

			if (!products.length) {
				errors.push('Продукты не указаны')
			}
			if (!name) {
				errors.push('Название не указано')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			const collection = await Collection.create({
				name: name,
				visible: visible,
				filename: fileName,
			})

			for (const product of products) {
				await CollectionProducts.create({
					collectionId: collection.id,
					productId: product,
				})
			}

			return sendResponse(res, 200, 'success', {
				data: [
					await Collection.findOne({
						where: { id: collection.id },
						include: [
							{
								model: CollectionProducts,
								include: [
									{
										model: Product,
										include: [Manufacturer, Category, ProductImages],
									},
								],
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

	async getAll(req, res) {
		try {
			const errors = []
			const collectionList = await Collection.findAll({
				include: [
					{
						model: CollectionProducts,
						include: [
							{
								model: Product,
								include: [Manufacturer, Category, ProductImages],
							},
						],
					},
				],
			})

			if (!collectionList) {
				errors.push('Коллекции не найдены')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', { data: collectionList })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}

	async getOne(req, res) {
		try {
			const { id } = req.params
			const errors = []
			const collection = await Collection.findOne({
				where: { id: id },
				include: [
					{
						model: CollectionProducts,
						include: [
							{
								model: Product,
								include: [Manufacturer, Category, ProductImages],
							},
						],
					},
				],
			})

			if (!collection) {
				errors.push('Коллекция не найдена')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', { data: [collection] })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}

	async update(req, res) {
		try {
			const errors = []
			const { id } = req.params
			const { products, visible, name } = req.body
			const fileName = req?.file?.filename || null
			const oldCollection = await Collection.findOne({
				where: { id: id },
			})

			if (!oldCollection) {
				errors.push('Коллекция не найдена')
			}
			if (!name) {
				errors.push('Название не указано')
			}
			if (!products) {
				errors.push('Продукты не заполнены')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			const collection = await Collection.update(
				{
					name: name,
					visible: visible,
					filename: fileName,
				},
				{
					where: { id: id },
				}
			)
			await CollectionProducts.destroy({ where: { collectionId: id } })
			for (const product of products) {
				await CollectionProducts.create({
					collectionId: id,
					productId: product,
				})
			}

			deleteImages(new Array(oldCollection))

			return sendResponse(res, 200, 'success', {
				data: [
					await Collection.findOne({
						where: { id: id },
						include: [
							{
								model: CollectionProducts,
								include: [
									{
										model: Product,
										include: [Manufacturer, Category, ProductImages],
									},
								],
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

	async delete(req, res) {
		try {
			const errors = []
			const { id } = req.params
			const collection = await Collection.findOne({ where: { id: id } })

			if (!collection) {
				errors.push('Коллекция не найдена')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}
			await CollectionProducts.destroy({ where: { collectionId: id } })
			await Collection.destroy({ where: { id: id } })

			deleteImages(new Array(collection))

			return sendResponse(res, 200, 'success', {})
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
}

module.exports = new CollectionController()
