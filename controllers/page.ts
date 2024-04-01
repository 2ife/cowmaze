import { RequestHandler } from "express";

const renderHome: RequestHandler = (req, res, next) => {
  res.render("home");
};

const renderAdminHome: RequestHandler = (req, res, next) => {
  res.render("admin");
};
export { renderHome, renderAdminHome };
