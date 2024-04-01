"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchasePotion = void 0;
const models_1 = require("../models");
const common_1 = require("./common");
const purchasePotion = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const { potionIndex } = req.body;
        if (![0, 1, 2].includes(potionIndex)) {
            const errorObj = {
                place: "controllers-shop-purchasePotion",
                content: `invalid potionIndex! potionIndex: ${potionIndex}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        if (user.chargeCash > 0) {
            const errorObj = {
                place: "controllers-shop-purchasePotion",
                content: `already have chargeCash! chargeCash: ${user.chargeCash}`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, errorObj.content);
        }
        const neededCash = [300, 2000, 10000][potionIndex];
        user.chargeCash += neededCash;
        user.depositDeadLine = Date.now() + 86400000;
        user.potion += 10 ** potionIndex;
        if (user.hp === 0) {
            user.potion--;
            user.hp = 1000;
        }
        const transaction = await models_1.sequelize.transaction();
        try {
            await user.save({ transaction });
            await transaction.commit();
        }
        catch (err) {
            await transaction.rollback();
            const errorObj = {
                place: "controllers-shop-purchasePotion",
                content: `purchasePotion transaction error`,
                user: user.loginId,
            };
            throw new common_1.ReqError(errorObj, err.message);
        }
        res.json({ answer: "purchasePotion success" });
    }
    catch (err) {
        if (!err.place) {
            err.place = "controllers-shop-purchasePotion";
            err.content = "purchasePotionError";
            err.user = null;
        }
        next(err);
    }
};
exports.purchasePotion = purchasePotion;
