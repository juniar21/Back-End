import { Router } from "express";
import { ExpenseControllerV2 } from "../controllers/expenseV2.controller";

export class ExpenseRouterV2 {
    private router : Router;
    private expenseControllerV2 : ExpenseControllerV2;

    constructor(){
        this.router = Router();
        this.expenseControllerV2 = new ExpenseControllerV2();
        this.initializeROute(); 
    }

    private initializeROute(){
        this.router.get("/", this.expenseControllerV2.getExpense)
        this.router.post("/",this.expenseControllerV2.InputNewData)
        this.router.patch("/edit/:id", this.expenseControllerV2.EditData)
        this.router.delete("/:id",this.expenseControllerV2.DeleteExpense)
        this.router.get("/:id", this.expenseControllerV2.getExpensebyId)
    }

    getRouter(): Router {
        return this.router;
    }
}