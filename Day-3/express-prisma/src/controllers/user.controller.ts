import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "../../prisma/generated/client";

export class UserController {
 
  async getUser(req: Request, res: Response) {
    try {
      const { search } = req.query;
      const filter: Prisma.UserWhereInput = {};
      if (search) {
        filter.username = { contains: search as string };
      }

      const users = await prisma.user.findMany({
        where: filter,
        orderBy: { id: "asc" },
        // take:2,
        // skip:1
      });

      const stats = await prisma.user.aggregate({
        _count: {username: true},//bisa juga _all jika mau mengambil semua
        _max: {createdAt:true},
        _min: {createdAt:true}

      })

      res.status(200).send({
        message: "User Data",
        users,
        stats,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });
      res.status(200).send({
        rc: 200,
        success: true,
        result: user,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async DeleteById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleteUser = await prisma.user.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.status(200).send({
        message: "User delete 😭",
        success: true,
        result: deleteUser,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async EditUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // bisa juga ->const data: Prisma.UserUpdateInput = req.data -> Prisma yang diambil dari generated client
      const editUser = await prisma.user.update({
        where: {
          id: parseInt(id),
        },
        data: req.body,
      });
      res.status(200).send({
        message: "User Update 😁",
        success: true,
        result: editUser,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async getUserByPost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        }, 
        include: {Post:true}

      });
      // const stats = await prisma.post.aggregate({
      //   _count: {userId: true},
      //   where: {
      //     userId:+id
      //   }
      // })
      res.status(200).send({
        rc: 200,
        success: true,
        result: user,
       
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

}
