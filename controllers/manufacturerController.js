const { Manufacturer } = require('../models/models')
const deleteImages = require('../utils/deleteImages')
const sendResponse = require('../utils/sendResponse')

class ManufacturerController {
	async create(req, res) {
		try {
			const { name, description, contact } = req.body
			const fileName = req.file?.filename || null
			const errors = []

			if (!fileName) {
				errors.push('Картинка не загружена')
			}
			if (!name) {
				errors.push('Название не указано')
			}
			if (!description) {
				errors.push('Описание не указано')
			}
			if (!contact) {
				errors.push('Контакт не указан')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			const manufacturer = await Manufacturer.create({
				name: name,
				filename: fileName,
				description: description,
				contact: contact,
			})

			return sendResponse(res, 200, 'success', { data: [manufacturer] })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}

	async getAll(req, res) {
		try {
			const manufacturerList = await Manufacturer.findAll()
			const errors = []

			if (!manufacturerList) {
				errors.push('Производители не найдены')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', {
				data: manufacturerList,
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
			const manufacturer = await Manufacturer.findOne({
				where: { id: id },
			})
			const errors = []

			if (!manufacturer) {
				errors.push('Категория не найдена')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			return sendResponse(res, 200, 'success', { data: [manufacturer] })
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}

	async update(req, res) {
		try {
			const { id } = req.params
			const { name, description, contact } = req.body
			const fileName = req.file?.filename || null
			const oldManufacturer = await Manufacturer.findOne({
				where: { id: id },
			})
			const errors = []

			if (!oldManufacturer) {
				errors.push('Производитель не найден')
			}
			if (!fileName) {
				errors.push('Картинка не загружена')
			}
			if (!name) {
				errors.push('Название не указано')
			}
			if (!description) {
				errors.push('Описание не указано')
			}
			if (!contact) {
				errors.push('Контакт не указан')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			await Manufacturer.update(
				{
					name: name,
					filename: fileName,
					description: description,
					contact: contact,
				},
				{
					where: { id: id },
				}
			)
			deleteImages(new Array(oldManufacturer))

			return sendResponse(res, 200, 'success', {
				data: [await Manufacturer.findOne({ where: { id: id } })],
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
			const manufacturer = await Manufacturer.findOne({
				where: { id: id },
			})
			const errors = []

			if (!manufacturer) {
				errors.push('Производитель не найден')
			}
			if (errors.length) {
				return sendResponse(res, 200, 'error', { message: errors })
			}

			Manufacturer.destroy({ where: { id: id } })
			deleteImages([manufacturer])

			return sendResponse(res, 200, 'success', {})
		} catch (e) {
			sendResponse(res, 500, 'error', {
				message: `Ошибка сервера - ${e}`,
			})
		}
	}
}

module.exports = new ManufacturerController()
