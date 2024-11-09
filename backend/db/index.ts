import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { usersTable } from './schema';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  // Insert new user
  const user: typeof usersTable.$inferInsert = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
  };
  await db.insert(usersTable).values(user);
  console.log('New user created!');

  // Get all users
  const users = await db.select().from(usersTable);
  console.log('All users:', users);

  // Update user info
  await db.update(usersTable)
    .set({ age: 31 })
    .where(eq(usersTable.email, 'john@example.com'));
  console.log('User updated!');

  // Delete user
  await db.delete(usersTable).where(eq(usersTable.email, 'john@example.com'));
  console.log('User deleted!');
}

main();
