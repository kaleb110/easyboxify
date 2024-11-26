
import Router from "express"
import { db } from "../../db/index"
import { User } from "../../db/schema"
import { eq } from "drizzle-orm"

const planRouter = Router()

// In your API (Express route)
planRouter.get("/", async (req, res) => {
  const userId = req.userId; // Extract from the token or session

  try {
    const user = await db.select().from(User).where(eq(User.id, userId));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const plan = user[0].plan; // Assuming `plan` stores the subscription status
    res.json({ plan });
  } catch (error) {
    console.error("Error fetching user subscription", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default planRouter