import { Router } from "express";
import { TrackerController } from "../controllers/tracker.controller";


export class TrackerRouter {
    private router : Router;
    private trackerController : TrackerController;


    constructor(){
        this.router = Router();
        this.trackerController = new TrackerController();
        this.initializeController();
    }

    private initializeController(){
        this.router.get("/",this.trackerController.getExpenseList);
        this.router.get("/", this.trackerController.getTracker);
        this.router.post("/",this.trackerController.inputExpenseTracker);
        this.router.get("/totalexpense",this.trackerController.getTotalNominalExpense);
        this.router.get("/totalexpensedate",this.trackerController.getExpenseDateRange)
        this.router.get("/:id",this.trackerController.getExpensedetails);
    }

    getRouter(): Router {
        return this.router;
    }
}