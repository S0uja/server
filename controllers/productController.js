const sendResponse = require('../utils/sendResponse')
const deleteImages = require('../utils/deleteImages')
const sequelize = require('sequelize')
const {
	Product,
	ProductImages,
	Review,
	OrderProducts,
	Category,
	Manufacturer,
	Collection,
	CollectionProducts,
} = require('../models/models')

class ProductController {
	async create(req, res) {
		try {
			const {
				name,
				price,
				amount,
				description,
				categoryId,
				manufacturerId,
				expirationdate,
				storageconditions,
				structure,
				weight_volume,
			} = req.body
			const images = req.files

			const errors = []

			if (!name) {
				errors.push('Название не указано')
			}
			if (!price) {
				errors.push('Цена не указана')
			}
			if (!amount) {
				errors.push('Количество не указано')
			}
			if (!description) {
				errors.push('Описание не указано')
			}
			if (!categoryId) {
				errors.push('Категория не указана')
			}
			if (!manufacturerId) {
				errors.push('Идентификатор производителя не указан')
			}
			if (!expirationdate) {
				errors.push('Срок годности не указан')
			}
			if (!storageconditions) {
				errors.push('Условия хранения не указаны')
			}
			if (!structure) {
				errors.push('Состав не указан')
			}
			if (!weight_volume) {
				errors.push('Объем или вес не указан')
			}
			if (errors.length) {
				return sendResponse(res, 400, 'error', { message: errors })
			}

			const product = await Product.create({
				name: name,
				price: price,
				amount: amount,
				description: description,
				categoryId: categoryId,
				manufacturerId: manufacturerId,
				expirationdate: expirationdate,
				storageconditions: storageconditions,
				structure: structure,
				weight_volume: weight_volume,
			})

			for (const image of images) {
				await ProductImages.create({
					filename: image.filename,
					productId: product.id,
				})
			}

			return sendResponse(res, 200, 'success', {
				data: [
					await Product.findOne({
						where: { id: product.id },
						include: [ProductImages, Category, Manufacturer],
					}),
				],
			})
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}

	async getMainPage(req, res) {
		try {
			const categories = await Category.findAll({
				where: { parentId: { [sequelize.Op.not]: null } },
			})
			const collections = await Collection.findAll({
				where: { visible: true },
				include: [
					{
						model: CollectionProducts,
						include: [
							{
								model: Product,
								include: [
									ProductImages,
									Category,
									Manufacturer,
									{
										model: Review,
										attributes: [],
									},
									{
										model: OrderProducts,
										attributes: [],
									},
								],
								attributes: {
									include: [
										[
											sequelize.literal(
												'(SELECT AVG(rate) FROM reviews WHERE reviews.productId = `collection_products.product.id`)'
											),
											'avgReview',
										],
										[
											sequelize.literal(
												'(SELECT COUNT(*) FROM order_products WHERE order_products.productId = `collection_products.product.id`)'
											),
											'orders',
										],
									],
								},
							},
						],
					},
				],
			})

			return sendResponse(res, 200, 'success', {
				data: {
					title: 'Главная страница',
					list: [{ cards: categories, collections: collections }],
					totalPages: 0,
				},
			})
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}

	async getPage(req, res) {
		try {
			let { limit, page, sort, sortmode, search, category, manufacturer } =
				req.query
			sort = sort || 'updatedAt'
			sortmode = sortmode || 'asc'
			search = search || ''
			category = category || ''
			manufacturer = manufacturer || ''
			page = parseInt(page) || 1
			limit = parseInt(limit) || 20
			const offset = page * limit - limit

			const productsList = await Product.findAll({
				include: [
					ProductImages,
					Category,
					Manufacturer,
					{
						model: Review,
						attributes: [],
					},
					{
						model: OrderProducts,
						attributes: [],
					},
				],
				attributes: {
					include: [
						[
							sequelize.literal(
								'(SELECT AVG(rate) FROM reviews WHERE reviews.productId = product.id)'
							),
							'avgReview',
						],
						[
							sequelize.literal(
								'(SELECT COUNT(*) FROM order_products WHERE order_products.productId = product.id)'
							),
							'orders',
						],
					],
				},
				where: {
					name: { [sequelize.Op.like]: `%${search}%` },
					...(manufacturer ? { manufacturerId: manufacturer } : {}),
					...(category ? { categoryId: category } : {}),
				},
				order: [[sort, sortmode]],
				limit: limit,
				offset: offset,
			})

			const products = await Product.findAndCountAll({
				where: {
					name: { [sequelize.Op.like]: `%${search}%` },
					...(manufacturer ? { manufacturerId: manufacturer } : {}),
					...(category ? { categoryId: category } : {}),
				},
				include: [Manufacturer],
			})

			const totalProducts = products.count

			const totalPages = Math.ceil(totalProducts / limit)

			let manufacturers = []

			if (!manufacturer.length) {
				const tmpManufacturers = products.rows.map(product => {
					return product.manufacturer
				})
				const setManufacturers = new Set(tmpManufacturers.map(JSON.stringify))
				manufacturers = Array.from(setManufacturers).map(JSON.parse)
			}

			const errors = []

			if (!productsList) {
				errors.push('Товары не найдены')
			}
			if (errors.length) {
				return sendResponse(res, 400, 'error', { message: errors })
			}
			return sendResponse(res, 200, 'success', {
				data: {
					title: 'Поиск',
					list: productsList,
					totalPages: totalPages,
					manufacturers: manufacturers,
				},
			})
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}

	async getAll(req, res) {
		try {
			const productsList = await Product.findAll({
				include: [ProductImages, Category, Manufacturer],
			})
			const errors = []

			if (!productsList) {
				errors.push('Товары не найдены')
			}
			if (errors.length) {
				return sendResponse(res, 400, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', { data: productsList })
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
			const product = await Product.findOne({
				where: { id: id },
				include: [
					Category,
					Manufacturer,
					ProductImages,
					Review,
					{
						model: OrderProducts,
						attributes: [],
					},
				],
				attributes: {
					include: [
						[sequelize.fn('AVG', sequelize.col('reviews.rate')), 'avgReview'],
						[
							sequelize.fn('COUNT', sequelize.col('order_products.id')),
							'orders',
						],
					],
				},
				group: ['product.id', 'product_images.id', 'reviews.id'],
			})

			if (!product) {
				errors.push('Товар не найден')
			}
			if (errors.length) {
				return sendResponse(res, 400, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', { data: [product] })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}

	async update(req, res) {
		try {
			const { id } = req.params
			const {
				name,
				price,
				amount,
				description,
				categoryId,
				manufacturerId,
				expirationdate,
				storageconditions,
				structure,
				weight_volume,
			} = req.body
			const images = req.files
			const oldProduct = await Product.findAll({ where: { id: id } })
			const oldProductImages = await ProductImages.findAll({
				where: { productId: id },
			})
			const errors = []

			if (!oldProduct) {
				errors.push('Товар не найден')
			}
			if (!name) {
				errors.push('Название не указано')
			}
			if (!price) {
				errors.push('Цена не указана')
			}
			if (!amount) {
				errors.push('Количество не указано')
			}
			if (!description) {
				errors.push('Описание не указано')
			}
			if (!categoryId) {
				errors.push('Категория не указана')
			}
			if (!manufacturerId) {
				errors.push('Идентификатор производителя не указан')
			}
			if (!expirationdate) {
				errors.push('Срок годности не указан')
			}
			if (!storageconditions) {
				errors.push('Условия хранения не указаны')
			}
			if (!structure) {
				errors.push('Состав не указан')
			}
			if (!weight_volume) {
				errors.push('Объем или вес не указан')
			}
			if (errors.length) {
				return sendResponse(res, 400, 'error', { message: errors })
			}

			//Обновление данные продукта
			await Product.update(
				{
					name: name,
					price: price,
					amount: amount,
					description: description,
					categoryId: categoryId,
					manufacturerId: manufacturerId,
					expirationdate: expirationdate,
					storageconditions: storageconditions,
					structure: structure,
					weight_volume: weight_volume,
				},
				{
					where: { id: id },
				}
			)

			//Удаление старых изображений
			await ProductImages.destroy({ where: { productId: id } })
			deleteImages(oldProductImages)

			//Сохранение новых изображений
			for (const image of images) {
				await ProductImages.create({
					filename: image.filename,
					productId: id,
				})
			}

			return sendResponse(res, 200, 'success', {
				data: [
					await Product.findOne({
						where: { id: id },
						include: [ProductImages, Category, Manufacturer],
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
			const { id } = req.params
			const product = await Product.findOne({ where: { id: id } })
			const errors = []

			if (!product) {
				errors.push('Товар не найден')
			}
			if (errors.length) {
				return sendResponse(res, 400, 'error', { message: errors })
			}

			//Удаление товара
			await Product.destroy({ where: { id: id } })

			//Удаление изображений
			deleteImages(await ProductImages.findAll({ where: { productId: id } }))
			await ProductImages.destroy({ where: { productId: id } })

			return sendResponse(res, 200, 'success', {})
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
}

module.exports = new ProductController()
