import { Request, Response } from "express";
import prisma from "../prisma";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { transporter } from "../helpers/mailer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, username, fullname } = req.body;

      const salt = await genSalt(10);
      const hashedPass = await hash(password, salt);

      const user = await prisma.user.create({
        data: { email, password: hashedPass, username, fullname },
      });

      const payload = { id: user.id, role: "user" };
      const token = sign(payload, process.env.KEY_JWT!, {
        expiresIn: "10m",
      });

      const link = `${process.env.URL_FE}/verify/${token}`;

      const templatePath = path.join(__dirname, "../templates", `verify.hbs`);
      const templateSource = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({ username, link });

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Email Verification",
        html,
      });

      res.status(201).send({ message: "User created 👌" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw { message: "User Not Found" };
      if (!user.isVerify) throw { message: "Account Not verify" };

      const isValidPass = await compare(password, user.password);
      if (!isValidPass) throw { message: "Incorrect Password" };

      const payload = { id: user.id, role: "user" };
      const access_token = sign(payload, process.env.KEY_JWT!, {
        expiresIn: "1h",
      }); //IG itu adalah secret key

      res.status(200).send({
        message: "Login Succesfully!",
        data: user,
        access_token,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async verify(req: Request, res: Response) {
    try {
      await prisma.user.update({
        data: { isVerify: true },
        where: { id: req.user?.id },
      });

      res.status(200).send({
        message: "Verified Successfully!",
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
