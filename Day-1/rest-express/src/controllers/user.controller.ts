import { Request, Response } from "express";
import fs from "fs"; //untuk memmbaca data di file json
import { IUser } from "../type";

export class UserController {
  getUser(req: Request, res: Response) {
    const userS: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8")
    );

    res.status(200).send({
      message: "User Data with id",
      data: { userS },
    });
  }
  getUsers(req: Request, res: Response) {
    const userS: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8")
    );

    const { name } = req.query;

    // Pastikan name ada dan bertipe string
    if (!name || typeof name !== "string") {
      res.status(400).send({ message: "Invalid name parameter!" });
      return;
    } 

    // Filter berdasarkan 2 huruf terakhir dari setiap nama
    const names: IUser[] = userS.filter((item) =>
      item.name.toLowerCase().includes(name.toLowerCase())
    );

    if (names.length === 0) {
      res.status(404).send({ message: "User not found!" });
      return;
    }

    res.status(200).json({
      message: "Users Data",
      data: { names },
    });
  }
  getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const userS: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8")
    );
    const user: IUser | undefined = userS.find((item) => item.id == +id); //cara cepat mengubah string ke number dengan menambah +
    if (!user) {
      res.status(400).send({ message: "User not found!" });
      return;
    }

    res.status(200).send({
      message: `User Data with id ${id} `,
      data: { user },
    });
  }
}
