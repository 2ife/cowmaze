"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderAdminHome = exports.renderHome = void 0;
const renderHome = (req, res, next) => {
    res.render("home");
};
exports.renderHome = renderHome;
const renderAdminHome = (req, res, next) => {
    res.render("admin");
};
exports.renderAdminHome = renderAdminHome;
