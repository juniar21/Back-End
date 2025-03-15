import express, { Application, Request, Response, Router } from "express";
import { TrackerRouter } from "./routers/tracker.router";
import pool from "./config/db";
import "dotenv/config";
import { ExpenseRouterV2 } from "./routers/expenseV2.router";

const PORT: number = 8000;

const app: Application = express();

app.use(express.json()); // agar bisa membaca body

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    status: "succsess",
    message: "Hi Client Tracker",
  });
});

pool.connect((err, client, release) => {
  if (err) {
    return console.log("error acquiring client", err.stack);
  }
  console.log("Success connection");
  release();
});
// console.log(process.env); -> untuk melihat apakah db dan melihat error yang ada
const expenseRouterV2 = new ExpenseRouterV2();
app.use("/api/expense", expenseRouterV2.getRouter());

const trackerRouter = new TrackerRouter();
app.use("/api/trackers", trackerRouter.getRouter());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
