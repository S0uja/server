const { OrderStatus } = require("../models/models");
const sendResponse = require("../utils/sendResponse");

class OrderStatusController {
    async create(req, res) {
        try {
            const errors = [];
            const { name } = req.body;

            if (!name) {
                errors.push("Имя не заполнено");
            }
            if (errors.length) {
                return sendResponse(res, 200, "error", { message: errors });
            }

            const result = await OrderStatus.create({ name: name });

            return sendResponse(res, 200, "success", { data: [result] });
        } catch (e) {
            sendResponse(res, 500, "error", {
                message: `Ошибка сервера - ${e}`,
            });
        }
    }

    async getAll(req, res) {
        try {
            const result = await OrderStatus.findAll();
            const errors = [];

            if (!result) {
                errors.push("Статусы заказа не найдены");
            }
            if (errors.length) {
                return sendResponse(res, 200, "error", { message: errors });
            }

            return sendResponse(res, 200, "success", { data: result });
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
            const result = await OrderStatus.findOne({ where: { id: id } });

            if (!result) {
                errors.push("Статус заказа не найден");
            }
            if (errors.length) {
                return sendResponse(res, 200, "error", { message: errors });
            }

            return sendResponse(res, 200, "success", { data: [result] });
        } catch (e) {
            sendResponse(res, 500, "error", {
                message: `Ошибка сервера - ${e}`,
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const result = OrderStatus.findOne({where:{id:id}})
            const errors = [];

            console.log(name);

            if (!result) {
                errors.push("Статус заказа не найден");
            }
            if (errors.length) {
                return sendResponse(res, 200, "error", { message: errors });
            }

            await OrderStatus.update({ name: name }, { where: { id: id } });

            return sendResponse(res, 200, "success", {})
        } catch (e) {
            sendResponse(res, 500, "error", {
                message: `Ошибка сервера - ${e}`,
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const errors = [];
            const result = await OrderStatus.destroy({ where: { id: id } });

            if (!result) {
                errors.push("Статус заказа не найден");
            }
            if (errors.length) {
                return sendResponse(res, 200, "error", { message: errors });
            }

            return sendResponse(res, 200, "success", {});
        } catch (e) {
            sendResponse(res, 500, "error", {
                message: `Ошибка сервера - ${e}`,
            });
        }
    }
}

module.exports = new OrderStatusController();
