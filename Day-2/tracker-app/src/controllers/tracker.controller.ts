import { Request, Response } from "express";
import { ITracker } from "../type";
import fs from "fs";

export class TrackerController {
  getTracker(req: Request, res: Response) {
    const trackerS: ITracker[] = JSON.parse(
      fs.readFileSync("./data/tracker.json", "utf-8")
    );

    res.status(200).json({
      message: "Tracker Data",
      data: { trackerS },
    });
  }

  inputExpenseTracker(req: Request, res: Response) {
    const { title, nominal, type, category, date } = req.body;
    const trackerS: ITracker[] = JSON.parse(
      fs.readFileSync("./data/tracker.json", "utf-8")
    );

    const Newid = trackerS.length;
    const id = Newid + 1;

    const newTracker = {
      id: id,
      title: title,
      nominal: Number(nominal),
      type: type,
      category: category,
      date: date,
    };

    if (newTracker.type != "expense") {
      res.status(404).json({ message: "You must input expense type" });
      return;
    }

    trackerS.push(newTracker);
    fs.writeFileSync("./data/tracker.json", JSON.stringify(trackerS), "utf-8");

    res.status(200).json({
      message: "Tracker Data",
      data: { trackerS },
    });
  }

  getExpensedetails(req: Request, res: Response) {
    const { id } = req.params;
    const trackerS: ITracker[] = JSON.parse(
      fs.readFileSync("./data/tracker.json", "utf-8")
    );

    const idtrack = trackerS.find(
      (item) => item.id == +id && item.type == "expense"
    );

    if (!idtrack) {
      res.status(404).json({ message: "Expense tracker with ID not found" });
      return;
    }

    res.status(200).json({
      message: "Tracker Data Expense",
      data: { idtrack },
    });
  }

  getExpenseList(req: Request, res: Response) {
    const { type } = req.query;
    const trackerS: ITracker[] = JSON.parse(
      fs.readFileSync("./data/tracker.json", "utf-8")
    );
    if (type != "expense") {
      res.status(404).json({ message: "You must track Expense" });
      return;
    }

    const typeTrack = trackerS.filter((item) => item.type == type);

    if (!typeTrack) {
      res.status(404).json({ message: "Expense tracker not found" });
      return;
    }

    res.status(200).json({
      message: "Tracker List Data Expense",
      data: { typeTrack },
    });
  }

  getTotalNominalExpense(req: Request, res: Response) {
    const { category, type } = req.query;
    const trackerS: ITracker[] = JSON.parse(
      fs.readFileSync("./data/tracker.json", "utf-8")
    );

    const filteredExpenses = trackerS.filter(
      (item) => item.category === category && item.type === type
    );

    // Jika tidak ada data dengan kategori yang dicari
    if (filteredExpenses.length === 0) {
      res
        .status(404)
        .json({ message: "Expense tracker not found for this category" });
      return;
    }

    const totExpense = filteredExpenses
      .map((item) => item.nominal)
      .reduce((a, b) => a + b, 0);

    if (!totExpense) {
      res.status(404).json({ message: "Expense tracker not found" });
      return;
    }

    res.status(200).json({
      message: "This All total expense",
      data: { totExpense },
    });
  }

  getExpenseDateRange(req: Request, res: Response) {
    const { type, startDate, endDate } = req.query;
    const trackerS: ITracker[] = JSON.parse(
      fs.readFileSync("./data/tracker.json", "utf-8")
    );

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    const filteredExpenses = trackerS.filter((item) => {
      const itemDate = new Date(item.date);

      const matchType = type ? item.type === type : true;

      const matchDate =
      (!start || itemDate >= start) &&
      (!end || itemDate <= end);

    return matchType && matchDate;
    });

    if (filteredExpenses.length === 0) {
        res.status(404).json({ message: "No expenses found for the given filter" });
        return
      }

    const nominalTot = filteredExpenses.reduce((a,b) => a + b.nominal,0)
    res.status(200).json({
        message: "This All total expense with Date Range",
        data: { nominalTot },
      });
  }
}
