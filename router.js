"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("./middleware");
const page_1 = require("./controllers/page");
const auth_1 = require("./controllers/auth");
const user_1 = require("./controllers/user");
const maze_1 = require("./controllers/maze");
const admin_1 = require("./controllers/admin");
const router = express_1.default.Router();
/* pageRouter */
router.get("/", middleware_1.apiLimiter, page_1.renderHome);
router.get("/admin", middleware_1.apiLimiter, page_1.renderAdminHome);
/* authRouter */
router.post("/auth/checkLoginCode", middleware_1.apiLimiter, auth_1.checkLoginCode);
router.post("/auth/login", middleware_1.apiLimiter, middleware_1.isNotLoggedIn, auth_1.login);
router.post("/auth/join", middleware_1.apiLimiter, middleware_1.isNotLoggedIn, auth_1.join);
router.post("/auth/leave", middleware_1.apiLimiter, middleware_1.isLoggedIn, auth_1.leave);
router.post("/auth/changeNick", middleware_1.apiLimiter, middleware_1.isLoggedIn, auth_1.changeNick);
router.post("/auth/changePassword", middleware_1.apiLimiter, middleware_1.isLoggedIn, auth_1.changePassword);
/* userRouter */
router.post("/user/getRankInfo", middleware_1.apiLimiter, middleware_1.isLoggedIn, user_1.getRankInfo);
/* mazeRouter */
router.post("/maze/enterNewPart", middleware_1.apiLimiter, middleware_1.isLoggedIn, maze_1.enterNewPart);
router.post("/maze/enterNewMaze", middleware_1.apiLimiter, middleware_1.isLoggedIn, maze_1.enterNewMaze);
router.post("/maze/saveCurrentData", middleware_1.apiLimiter, middleware_1.isLoggedIn, maze_1.saveCurrentData);
/* shopRouter */
// becauseOfTest
// router.post("/shop/purchasePotion", apiLimiter, isLoggedIn, purchasePotion);
/* adminRouter */
router.post("/admin/login", middleware_1.apiLimiter, middleware_1.isNotLoggedIn, admin_1.adminLogin);
router.post("/admin/checkLoginCode", middleware_1.apiLimiter, admin_1.checkAdminLoginCode);
router.post("/admin/searchUser", middleware_1.apiLimiter, middleware_1.isAdminLoggedIn, admin_1.searchUser);
router.post("/admin/checkDepositCompleted", middleware_1.apiLimiter, middleware_1.isAdminLoggedIn, admin_1.checkDepositCompleted);
router.post("/admin/changeNick", middleware_1.apiLimiter, middleware_1.isAdminLoggedIn, admin_1.changeNickInAdmin);
router.post("/admin/changePassword", middleware_1.apiLimiter, middleware_1.isAdminLoggedIn, admin_1.changePasswordInAdmin);
router.post("/admin/lockUser", middleware_1.apiLimiter, middleware_1.isAdminLoggedIn, admin_1.lockUser);
router.post("/admin/unlockUser", middleware_1.apiLimiter, middleware_1.isAdminLoggedIn, admin_1.unlockUser);
router.post("/admin/deleteUser", middleware_1.apiLimiter, middleware_1.isAdminLoggedIn, admin_1.deleteUser);
router.post("/admin/getMazeData", middleware_1.apiLimiter, middleware_1.isAdminLoggedIn, admin_1.getMazeData);
router.post("/admin/addMaze", middleware_1.apiLimiter, middleware_1.isAdminLoggedIn, admin_1.addMaze);
router.post("/admin/updateMaze", middleware_1.apiLimiter, middleware_1.isAdminLoggedIn, admin_1.updateMaze);
router.post("/admin/deleteMaze", middleware_1.apiLimiter, middleware_1.isAdminLoggedIn, admin_1.deleteMaze);
exports.default = router;
