# One-Click SAT

A Next.js application for creating and taking SAT tests.

## Supabase Type Generation

This project includes a feature to automatically generate TypeScript types from your Supabase database schema. This helps keep your frontend types in sync with your database schema.

### Prerequisites

- Node.js and npm installed
- Supabase project with access to the service role key

### Setup

1. Make sure your `.env.local` file includes the following variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Generating Types

To generate TypeScript types from your Supabase database schema:

```
npm run db:generate-types
```

This will:
1. Connect to your Supabase database using the service role key
2. Fetch all tables and their columns from the public schema
3. Generate TypeScript interfaces for each table
4. Save the generated types to `types/supabase-schema.ts`

### Pushing Types to GitHub

To automatically generate types and push them to GitHub:

```
npm run db:push-types
```

This will:
1. Generate the latest types from your Supabase schema
2. Check if there are any changes to commit
3. If changes exist, commit them with the message "chore: update Supabase schema types"
4. Push the changes to your GitHub repository

### Using Generated Types

Import the generated types in your code:

```typescript
import { YourTableName } from '@/types/supabase-schema';
```

### Best Practices

- Run the type generation script whenever you make changes to your database schema
- Use `npm run db:push-types` to automatically update and push types to GitHub
- Consider setting up a CI/CD pipeline to automatically generate types on database migrations

## Development

```
npm run dev
```

## Building for Production

```
npm run build
```

## Starting Production Server

```
npm run start
``` 