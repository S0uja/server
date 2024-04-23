const { Order, Product, User } = require("../models/models");
const sendResponse = require("../utils/sendResponse");
const today = new Date();
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
const sequelize = require("sequelize");
const fs = require('fs');

class StatisticController {
    async getMounthCountOrders(req, res) {
        try {
            
            const result = await Order.findAndCountAll({
                where: {
                  createdAt: {
                    [sequelize.Op.gte]: firstDayOfMonth,
                    [sequelize.Op.lte]: lastDayOfMonth
                  }
                }
              });

            return sendResponse(res, 200, "success", {
                data: [
                    result.count
                ],
            });
        } catch (e) {
            sendResponse(res, 500, "error", {
                message: `Ошибка сервера - ${e}`,
            });
        }
    }

    async getMounthEarn(req, res) {
        try {
            
            const orders = await Order.findAll({
                where: {
                  createdAt: {
                    [sequelize.Op.gte]: firstDayOfMonth,
                    [sequelize.Op.lte]: lastDayOfMonth
                  }
                }
            })
            const result = orders.reduce((acc,order)=>acc+order.price,0)

            return sendResponse(res, 200, "success", {
                data: [
                    result
                ],
            });
        } catch (e) {
            sendResponse(res, 500, "error", {
                message: `Ошибка сервера - ${e}`,
            });
        }
    }

    // async getCharts(req,res) {
    //     try {
    //         const currentDate = new Date();
    //         const countUsers = []

    //         const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    //         const firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    //         const firstDayOfTwoMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
    //         const firstDayOfThreeMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);

    //         const usersCurrentMonth = await User.findAndCountAll({
    //             where: {
    //                 createdAt: {
    //                 [sequelize.Op.gte]: firstDayOfCurrentMonth,
    //                 [sequelize.Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    //                 }
    //             }
    //         });

    //         const usersPreviousMonth = await User.findAndCountAll({
    //             where: {
    //                 createdAt: {
    //                 [sequelize.Op.gte]: firstDayOfPreviousMonth,
    //                 [sequelize.Op.lt]: firstDayOfCurrentMonth
    //                 }
    //             }
    //         });

    //         const usersTwoMonthsAgo = await User.findAndCountAll({
    //             where: {
    //                 createdAt: {
    //                 [sequelize.Op.gte]: firstDayOfTwoMonthsAgo,
    //                 [sequelize.Op.lt]: firstDayOfPreviousMonth
    //                 }
    //             }
    //         });

    //         const usersThreeMonthsAgo = await User.findAndCountAll({
    //             where: {
    //                 createdAt: {
    //                 [sequelize.Op.gte]: firstDayOfThreeMonthsAgo,
    //                 [sequelize.Op.lt]: firstDayOfTwoMonthsAgo
    //                 }
    //             }
    //         });

    //         countUsers.push(usersCurrentMonth.count);
    //         countUsers.push(usersPreviousMonth.count);
    //         countUsers.push(usersTwoMonthsAgo.count);
    //         countUsers.push(usersThreeMonthsAgo.count);

    //         console.log('Количество новых пользователей за текущий месяц:', countUsers);

    //     } catch (e) {
    //         sendResponse(res, 500, "error", {
    //             message: `Ошибка сервера - ${e}`,
    //         });
    //     }
    // }

    async getLogs(req,res) {
        try {

            const data = fs.readFileSync('logs.log', 'utf8');
            const result = data.split('\n').map(item=> {
                const splited = item.split('|')
                return {
                    date:splited[0],
                    user_id:splited[1],
                    role:splited[2],
                    method:splited[3],
                    path:splited[4],
                    ip:splited[5]
                }
            })
            result.pop()

            return sendResponse(res, 200, "success", {
                data: [
                    result
                ],
            });
        } catch (e) {
            sendResponse(res, 500, "error", {
                message: `Ошибка сервера - ${e}`,
            });
        }
    }
}

module.exports = new StatisticController();
