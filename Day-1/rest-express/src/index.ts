import express, { Application, Request, Response } from "express";
import { UserRouter } from "./routers/user.router";

const PORT: number = 8000;

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    status: "succsess",
    message: "welcome to my API",
  });
});

//response harus selalu ada kalo tidak akan selalu loading
const userRouter = new UserRouter()
app.use("/api/users", userRouter.getRouter());

//harus menggunakan app.user



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
