import { Request, Response } from "express";
import { queryHistory } from "../services/iocHistoryQueryService";

export async function historyController(req: Request, res: Response) {
  try {
    const owner = req.owner;
    if (!owner) {
      return res.status(400).json({ error: "Owner not resolved" });
    }

    const limit = Math.min(
      parseInt(req.query.limit as string) || 50,
      100
    );

    const offset = Math.max(
      parseInt(req.query.offset as string) || 0,
      0
    );

    const history = await queryHistory({
      ownerType: owner.type,
      ownerId: owner.id,
      limit,
      offset,
    });

    return res.json(history);
  } catch (err) {
    console.error("History fetch failed:", err);
    return res.status(500).json({ error: "Failed to fetch history" });
  }
}
