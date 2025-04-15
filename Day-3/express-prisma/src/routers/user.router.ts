import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class UserRouter {
  private router: Router;
  private userController: UserController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.get(
      "/",
      this.authMiddleware.verifyToken,
      this.userController.getUser
    );
    this.router.get("/redis", this.userController.getUserRedis)
    this.router.get("/", this.userController.getUser);
    this.router.get("/:id/post", this.userController.getUserByPost);
    this.router.get("/:id", this.userController.getUserById);
    this.router.delete(
      "/:id",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyAdmin,
      this.userController.DeleteById
    );
    this.router.put("/:id", this.userController.EditUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
