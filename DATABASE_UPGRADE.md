# Database Upgrade Guide

This project is currently configured to use **SQLite** with Prisma. This is great for local development and small-scale applications. However, for a production SaaS, you might want to upgrade to a more robust database like **PostgreSQL** or **MySQL**.

## 1. Upgrade to PostgreSQL (Recommended)

PostgreSQL is highly recommended for most SaaS applications.

### Step 1: Install PostgreSQL
Ensure you have a PostgreSQL instance running (e.g., via Supabase, Neon, or a local installation).

### Step 2: Update `prisma/schema.prisma`
Change the `datasource` block:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 3: Update `.env`
Change your `DATABASE_URL` in `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/quizmaster?schema=public"
```

### Step 4: Run Migrations
```bash
npx prisma migrate dev --name init
```

---

## 2. Upgrade to MySQL

MySQL is another popular choice, especially for high-read workloads.

### Step 1: Update `prisma/schema.prisma`
Change the `datasource` block:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### Step 2: Update `.env`
Change your `DATABASE_URL` in `.env`:
```env
DATABASE_URL="mysql://username:password@localhost:3306/quizmaster"
```

### Step 3: Run Migrations
```bash
npx prisma migrate dev --name init
```

---

## Important Migration Notes

- **Data Loss**: Switching database providers (e.g., SQLite to PostgreSQL) usually means you cannot easily "migrate" the data itself without using a data export/import tool. The `migrate dev` command will clear the target database if it finds existing incompatible structures.
- **Environment Variables**: Always keep your `DATABASE_URL` in your `.env` file and never commit it to version control.
- **Prisma Client**: After changing the provider, you might need to run `npx prisma generate` to update the Prisma Client types.
