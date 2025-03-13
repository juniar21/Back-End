import { Request, Response } from "express";
import fs from "fs"; //untuk memmbaca data di file json
import { IUser } from "../type";

export class UserController {
  getUserbyName(req: Request, res: Response) {
    const userS: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8") //bisa juga jadi let sehingga berubah
    );

    const { name } = req.query;

    if (!name) {
      res.status(200).send({
        // jika di atas menggunakan let ini tidak perlu lagi
        message: "User Data with id",
        data: { userS },
      });
    }

    // Pastikan name ada dan bertipe string
    if (typeof name !== "string") {
      res.status(400).send({ message: "Invalid name parameter!" });
      return;
    }

    // Filter berdasarkan 2 huruf terakhir dari setiap nama
    const names: IUser[] = userS.filter(
      (item) => item.name.toLowerCase().includes(name.toLowerCase())
      // tipe data name yang dibandingin memang string na cara kedua untuk validasi adalah name as string
    );

    if (names.length === 0) {
      res.status(404).send({ message: "User not found!" });
      return;
    }

    res.status(200).json({
      // jika di atas adalah let data bisa langsung ke user
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
  createUser(req: Request, res: Response) {
    const userS: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8")
    );
    const idLength = userS.length + 1;
    const userBaru = {
      id: idLength,
      name: req.body.name,
      email: req.body.email,
    };
    userS.push(userBaru);

    fs.writeFileSync("./data/user.json", JSON.stringify(userS));

    res.status(201).send({
      message: "Create User Succesfully!",
    });
  }
  deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const userS: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8")
    );

    const idUser = userS.findIndex((item) => item.id == +id);

    if (idUser == -1) {
      //jika divalidasi dan index tidak ada pasti hasilnya -1
      res.status(400).send({ message: "User not found!" });
      return;
    }
    userS.splice(idUser, 1);

    fs.writeFileSync("./data/user.json", JSON.stringify(userS));

    res.status(201).send({
      message: "Delete User Succesfully!",
    });
  }

  edituser(req: Request, res: Response) {
    const { id } = req.params;
    const updates = req.body;
    const userS: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8")
    );
    const idUser = userS.findIndex((item) => item.id == +id);

    if (idUser == -1) {
      //jika divalidasi dan index tidak ada pasti hasilnya -1
      res.status(400).send({ message: "User not found!" });
      return;
    }
    const fields = ["name", "emai"];
    const isValid = Object.keys(req.body).every((key) => fields.includes(key));
    if (isValid) {
      res.status(201).send("Invalid field");
      return;
    }

    userS[idUser] = { ...userS[idUser], ...updates };

    fs.writeFileSync("./data/user.json", JSON.stringify(userS));

    res.status(201).send({
      message: "Update User Succesfully!",
    });
  }


}
