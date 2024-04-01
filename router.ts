import express from "express";
import {
  apiLimiter,
  isLoggedIn,
  isNotLoggedIn,
  isAdminLoggedIn,
} from "./middleware";
import { renderHome, renderAdminHome } from "./controllers/page";
import {
  checkLoginCode,
  login,
  join,
  leave,
  changeNick,
  changePassword,
} from "./controllers/auth";
import { getRankInfo } from "./controllers/user";
import {
  enterNewPart,
  enterNewMaze,
  saveCurrentData,
} from "./controllers/maze";
import { purchasePotion } from "./controllers/shop";
import {
  adminLogin,
  checkAdminLoginCode,
  searchUser,
  checkDepositCompleted,
  changeNickInAdmin,
  changePasswordInAdmin,
  lockUser,
  unlockUser,
  deleteUser,
  getMazeData,
  addMaze,
  updateMaze,
  deleteMaze,
} from "./controllers/admin";
const router = express.Router();
/* pageRouter */
router.get("/", apiLimiter, renderHome);
router.get("/admin", apiLimiter, renderAdminHome);
/* authRouter */
router.post("/auth/checkLoginCode", apiLimiter, checkLoginCode);
router.post("/auth/login", apiLimiter, isNotLoggedIn, login);
router.post("/auth/join", apiLimiter, isNotLoggedIn, join);
router.post("/auth/leave", apiLimiter, isLoggedIn, leave);
router.post("/auth/changeNick", apiLimiter, isLoggedIn, changeNick);
router.post("/auth/changePassword", apiLimiter, isLoggedIn, changePassword);
/* userRouter */
router.post("/user/getRankInfo", apiLimiter, isLoggedIn, getRankInfo);
/* mazeRouter */
router.post("/maze/enterNewPart", apiLimiter, isLoggedIn, enterNewPart);
router.post("/maze/enterNewMaze", apiLimiter, isLoggedIn, enterNewMaze);
router.post("/maze/saveCurrentData", apiLimiter, isLoggedIn, saveCurrentData);
/* shopRouter */
// becauseOfTest
// router.post("/shop/purchasePotion", apiLimiter, isLoggedIn, purchasePotion);
/* adminRouter */
router.post("/admin/login", apiLimiter, isNotLoggedIn, adminLogin);
router.post("/admin/checkLoginCode", apiLimiter, checkAdminLoginCode);
router.post("/admin/searchUser", apiLimiter, isAdminLoggedIn, searchUser);
router.post(
  "/admin/checkDepositCompleted",
  apiLimiter,
  isAdminLoggedIn,
  checkDepositCompleted
);
router.post(
  "/admin/changeNick",
  apiLimiter,
  isAdminLoggedIn,
  changeNickInAdmin
);
router.post(
  "/admin/changePassword",
  apiLimiter,
  isAdminLoggedIn,
  changePasswordInAdmin
);
router.post("/admin/lockUser", apiLimiter, isAdminLoggedIn, lockUser);
router.post("/admin/unlockUser", apiLimiter, isAdminLoggedIn, unlockUser);
router.post("/admin/deleteUser", apiLimiter, isAdminLoggedIn, deleteUser);
router.post("/admin/getMazeData", apiLimiter, isAdminLoggedIn, getMazeData);
router.post("/admin/addMaze", apiLimiter, isAdminLoggedIn, addMaze);
router.post("/admin/updateMaze", apiLimiter, isAdminLoggedIn, updateMaze);
router.post("/admin/deleteMaze", apiLimiter, isAdminLoggedIn, deleteMaze);
export default router;
