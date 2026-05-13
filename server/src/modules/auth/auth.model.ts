import { eq } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { usersTable, type User, type NewUser } from "../../common/db/schema.js";

const UserModel = {
  async findByEmail(email: string): Promise<User | undefined> {
    const rows = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1);
    return rows[0];
  },

  async findById(id: string): Promise<User | undefined> {
    const rows = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);
    return rows[0];
  },

  async findByClerkId(clerkId: string): Promise<User | undefined> {
    const rows = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkId))
      .limit(1);
    return rows[0];
  },

  async create(values: NewUser): Promise<User> {
    const [row] = await db.insert(usersTable).values(values).returning();
    return row!;
  },

  async updateRefreshToken(
    id: string,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await db
      .update(usersTable)
      .set({ refreshTokenHash, updatedAt: new Date() })
      .where(eq(usersTable.id, id));
  },
};

export default UserModel;
