import { Request, Response } from "express";
import pool from "../config/db";

export class ExpenseControllerV2 {
  async getExpense(req: Request, res: Response) {
    try {
      const { rows } = await pool.query(
        "select * from expense order by id asc"
      );
      res.status(200).send({
        message: "Data Expense 👌",
        data: rows,
      });
    } catch (err) {
      console.log(err);

      res.status(400).send(err);
    }
  }

  async getExpensebyId(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const { rows } = await pool.query(
        `select * from expense where id = ${id}`
      );
      res.status(200).send({
        message: "Data Expense 👌",
        data: rows,
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
    const { id } = req.params;
    const updates = req.body;

    try {
      const fields = Object.keys(updates)
        .map((key) => `${key} = '${updates[key]}'`)
        .join(", ");
      console.log(Object.keys(updates).map(key => `${key} = '${updates[key]}'`));
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
