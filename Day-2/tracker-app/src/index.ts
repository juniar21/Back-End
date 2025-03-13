import express, { Application, Request, Response, Router } from "express";
import { TrackerRouter } from "./routers/tracker.router";

const PORT:number = 8000;

const app:Application = express();

app.use(express.json()); // agar bisa membaca body

app.get("/", (req:Request, res:Response) =>{
    res.status(200).send({
        status: "succsess",
        message: "Hi Client Tracker"
    });
});

const trackerRouter = new TrackerRouter()
app.use("/api/trackers", trackerRouter.getRouter())

app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`);
})

