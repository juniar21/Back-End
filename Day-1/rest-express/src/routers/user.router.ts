import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export class UserRouter {
    private router : Router;
    private userController: UserController;

    constructor(){
        this.router = Router();
        this.userController = new UserController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/search", this.userController.getUsers);
        this.router.get("/:id", this.userController.getUserById);
        this.router.get("/", this.userController.getUser)
        // add another routes
    }
    getRouter(): Router {
        return this.router;
    } 

}