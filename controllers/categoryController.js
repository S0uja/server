const sendResponse = require("../utils/sendResponse");
const deleteImages = require("../utils/deleteImages");
const { Category } = require("../models/models");

class CategoryController {
    async create(req, res) {
        try {
            const errors = [];
            const { parentId, name } = req.body;
            const fileName = req.file?.filename || null;

            if (!fileName) {
                errors.push("Картинка не загружена");
            }
            if (!name) {
                errors.push("Название не указано");
            }
            if (errors.length) {
                return sendResponse(res, 200, "error", { message: errors });
            }

            const category = await Category.create({
                parentId: parentId,
                name: name,
                filename: fileName,
            });

            return sendResponse(res, 200, "success", { data: [category] });
        } catch (e) {
            sendResponse(res, 500, "error", {
                message: `Ошибка сервера - ${e}`,
            });
        }
    }

    async getAll(req, res) {
        try {
            const errors = [];
            const categoriesList = await Category.findAll();

            if (!categoriesList) {
                errors.push("Категории не найдены");
            }
            if (errors.length) {
                return sendResponse(res, 200, "error", { message: errors });
            }

            return sendResponse(res, 200, "success", { data: categoriesList });
        } catch (e) {
            sendResponse(res, 500, "error", {
                message: `Ошибка сервера - ${e}`,
            });
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const errors = [];
            const category = await Category.findOne({ where: { id: id } });

            if (!category) {
                errors.push("Категория не найдена");
            }
            if (errors.length) {
                return sendResponse(res, 200, "error", { message: errors });
            }

            return sendResponse(res, 200, "success", { data: [category] });
        } catch (e) {
            sendResponse(res, 500, "error", {
                message: `Ошибка сервера - ${e}`,
            });
        }
    }

    async update(req, res) {
        try {
            const errors = [];
            const { id } = req.params;
            const { parentId, name } = req.body;
            const fileName = req?.file?.filename || null;
            const oldCategory = await Category.findOne({ where: { id: id } });

            if (!oldCategory) {
                errors.push("Категория не найдена");
            }
            if (!fileName) {
                errors.push("Картинка не загружена");
            }
            if (!name) {
                errors.push("Название не указано");
            }
            if (errors.length) {
                return sendResponse(res, 200, "error", { message: errors });
            }

            await Category.update(
                {
                    parentId: parentId,
                    name: name,
                    filename: fileName,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
            deleteImages(new Array(oldCategory));

            return sendResponse(res, 200, "success", {
                data: [await Category.findOne({ where: { id: id } })],
            });
        } catch (e) {
            sendResponse(res, 500, "error", {
                message: `Ошибка сервера - ${e}`,
            });
        }
    }

    async delete(req, res) {
        try {
            const errors = [];
            const { id } = req.params;
            const category = await Category.findOne({ where: { id: id } });

            if (!category) {
                errors.push("Категория не найдена");
            }
            if (errors.length) {
                return sendResponse(res, 200, "error", { message: errors });
            }

            await Category.destroy({ where: { id: id } });
            deleteImages(new Array(category));

            return sendResponse(res, 200, "success", {});
        } catch (e) {
            sendResponse(res, 500, "error", {
                message: `Ошибка сервера - ${e}`,
            });
        }
    }
}

module.exports = new CategoryController();
