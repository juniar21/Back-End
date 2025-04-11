import { Request, Response } from "express";
import prisma from "../prisma";
import { cloudinaryUpload } from "../helpers/cloudinary";

export class PostController {
  async getPost(req: Request, res: Response) {
    try {
      const posts = await prisma.post.findMany({
        // include: {user: true}, -> ini kalo ambil semua
        select: {
          id: true,
          imageUrl: true,
          caption: true,
          createdAt: true,
          user: {
            select: {
              username: true,
              email: true,
              Avatar: true,
            },
          },
          _count: {
            select: {
              Like: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const userLike = await prisma.like.findMany({
        where: { userId: req.user?.id },
      });

      const likePost = new Set(userLike.map((item) => item.postId));

      const result = posts.map((post) => {
        return { ...post, 
          liked: likePost.has(post.id),
          likeCount: post._count.Like,
         };
      });

      res.status(200).send({
        message: "Data Post",
        posts: result,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async createPost(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "Image empty" };
      const { caption } = req.body;
      const imageUrl = `http://localhost:8000/api/public/${req.file.filename}`;

      await prisma.post.create({
        data: { imageUrl, caption, userId: req.user?.id! },
      });

      res.status(201).send({
        message: "Post created",
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  // async createPost(req: Request, res: Response) {
  //     try {
  //       const { imageUrl, caption, userId } = req.body;
  //       await prisma.post.create({ data: { imageUrl, caption, userId} });
  //       res.status(201).send({ message: "Post created 👌" });
  //     } catch (err) {
  //       console.log(err);
  //       res.status(400).send(err);
  //     }
  //   }

  // async DeleteById(req: Request, res: Response) {
  //     try {
  //       const { id } = req.params;
  //       const deletePost = await prisma.post.delete({
  //         where: {
  //           id: parseInt(id),
  //         },
  //       });
  //       res.status(200).send({
  //         message: "Post delete 😭",
  //         success: true,
  //         result: deletePost,
  //       });
  //     } catch (err) {
  //       console.log(err);
  //       res.status(400).send(err);
  //     }
  //   }

  //   async EditPost(req: Request, res: Response) {
  //       try {
  //         const { id } = req.params;
  //         // bisa juga ->const data: Prisma.UserUpdateInput = req.data -> Prisma yang diambil dari generated client
  //         const editPost = await prisma.post.update({
  //           where: {
  //             id: parseInt(id),
  //           },
  //           data: req.body,
  //         });
  //         res.status(200).send({
  //           message: "Post Update 😁",
  //           success: true,
  //           result: editPost,
  //         });
  //       } catch (err) {
  //         console.log(err);
  //         res.status(400).send(err);
  //       }
  //     }

  async likePost(req: Request, res: Response) {
    try {
      const { postId } = req.body;

      const isLike = await prisma.like.findUnique({
        where: {
          postId_userId: {
            postId,
            userId: req.user?.id!,
          },
        },
      });
      if (isLike) {
        await prisma.like.delete({
          where: {
            postId_userId: {
              postId,
              userId: req.user?.id!,
            },
          },
        });
        res.status(200).send({ liked: false });
      } else {
        await prisma.like.create({
          data: {
            postId,
            userId: req.user?.id!,
          },
        });
        res.status(200).send({ liked: true });
      }
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async createPostCloud(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "image empty" };
      const { caption } = req.body;
      const { secure_url } = await cloudinaryUpload(req.file, "ig");

      await prisma.post.create({
        data: { imageUrl: secure_url, caption, userId: req.user?.id! },
      });

      res.status(201).send({
        message: "Post created",
        secure_url,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
