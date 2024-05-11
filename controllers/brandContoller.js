const { Brand } = require('../models/models')
const deleteImages = require('../utils/deleteImages')
const sendResponse = require('../utils/sendResponse')

class BrandController {
	async create(req, res) {
		try {
			const { name, manufacturerId } = req.body
			const fileName = req.file?.filename || null
			const errors = []

			if (!fileName) {
				errors.push('Картинка не загружена')
			}
			if (!name) {
				errors.push('Название не указано')
			}
			if (!manufacturerId) {
				errors.push('Производитель не указан')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			const brand = await Brand.create({
				name: name,
				filename: fileName,
				manufacturerId: manufacturerId,
			})

			return sendResponse(res, 200, 'success', { data: [brand] })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}

	async getAll(req, res) {
		try {
			const brandList = await Brand.findAll()
			const errors = []

			if (!brandList) {
				errors.push('Бренды не найдены')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', {
				data: brandList,
			})
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}

	async getOne(req, res) {
		try {
			const { id } = req.params
			const brand = await Brand.findOne({
				where: { id: id },
			})
			const errors = []

			if (!brand) {
				errors.push('Бренд не найден')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', { data: [brand] })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}

	async update(req, res) {
		try {
			const { id } = req.params
			const { name, manufacturerId } = req.body
			const fileName = req.file?.filename || null
			const oldBrand = await Brand.findOne({
				where: { id: id },
			})
			const errors = []

			if (!oldBrand) {
				errors.push('Бренд не найден')
			}
			if (!manufacturerId) {
				errors.push('Производитель не указан')
			}
			if (!fileName) {
				errors.push('Картинка не загружена')
			}
			if (!name) {
				errors.push('Название не указано')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			await Brand.update(
				{
					name: name,
					filename: fileName,
					manufacturerId: manufacturerId,
				},
				{
					where: { id: id },
				}
			)
			deleteImages(new Array(oldBrand))

			return sendResponse(res, 200, 'success', {
				data: [await Brand.findOne({ where: { id: id } })],
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
			const brand = await Brand.findOne({
				where: { id: id },
			})
			const errors = []

			if (!brand) {
				errors.push('Бренд не найден')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			Brand.destroy({ where: { id: id } })
			deleteImages([brand])

			return sendResponse(res, 200, 'success', {})
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
}

module.exports = new BrandController()
