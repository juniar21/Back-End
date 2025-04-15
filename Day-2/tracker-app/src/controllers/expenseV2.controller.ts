import { Request, Response } from "express";
import pool from "../config/db";

export class ExpenseControllerV2 {
  async getExpense(req: Request, res: Response) {
    try {
      const limit = 3;
      const page = parseInt(req.query.page as string) || 1
      const offset = (page-1) * limit
      const {rowCount} = await pool.query("select * from expense")
      const { rows } = await pool.query(
        `select * from expense order by id asc limit ${limit} offset ${offset}`
      );
      res.status(200).send({
        message: "Data Expense 👌",
        data: rows,
        meta : {
          page : page,
          limit : limit,
          totalPage : Math.ceil(rowCount!/limit)
        }
      });
    } catch (err) {
      console.log(err);

      res.status(400).send(err);
    }
  }

  async getExpensebyId(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const { rows} = await pool.query(
        `select * from expense where id = ${id}`
      );
      // console.log(rowCount); //untuk menghitung row karena nantinya rows itu jadi array
      res.status(200).send({
        message: "Data Expense 👌",
        data: rows, //bisa juga rows[0] -> agar langsung masuk ke objecknya
        
      });
    } catch (err) {
      console.log(err);

      res.status(400).send(err);
    }
  }
  async InputNewData(req: Request, res: Response) {
    const { title, nominal, type, category, date } = req.body;
    try {
      const { rows } = await pool.query(
        `insert into expense (title, nominal, "type", category, "date") 
        values ('${title}', ${nominal}, '${type}', '${category}', '${date}')`
      );
      res.status(200).send({
        message: "Data Input Ok 👌",
        data: rows,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async DeleteExpense(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const { rows } = await pool.query(`delete from expense where id = ${id}`);
      res.status(200).send({
        message: "Data Delete Ok 👌",
        data: rows,
      });
    } catch (err) {
      console.log(err);

      res.status(400).send(err);
    }
  }
  async EditData(req: Request, res: Response) {
    // interface Data {
    //   id : string,
    //   title: string,
    //   nominal:number,
    //   type:string,
    //   category:string,
    //   date:string
    // }
    const { id } = req.params;
    const updates = req.body;
    // let data:Data[] = []
    // const index = data.findIndex((item) => item.id === id); 
  
    try {
      const fields = Object.keys(updates)
        .map((key) => `${key} = '${updates[key]}'`)
        .join(", ");
      // console.log(Object.keys(updates).map(key => `${key} = '${updates[key]}'`));
      // console.log({ ...data[index], ...updates }); -> kalo cara ini ujungnya harus di masukkan ke object.key untuk di petakan
      
      const { rows } = await pool.query(
        `update expense set ${fields} where id = ${id};`
      );
      res.status(200).send({
        message: "Edit Data Ok 👌",
        data: rows,
      });
    } catch (err) {
      console.log(err);

      res.status(400).send(err);
    }
  }
}
