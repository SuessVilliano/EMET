# Supabase Setup Instructions for EMET Platform

This guide walks you through setting up a Supabase project for the EMET platform.

## Prerequisites

- A Supabase account (create one at [supabase.com](https://supabase.com))
- The EMET platform source code cloned locally
- Node.js 18+ installed

## Step 1: Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Select your organization (or create a new one)
4. Enter a project name (e.g., `emet-platform`)
5. Create a strong database password
6. Select your preferred region (closest to your users)
7. Click "Create new project"
8. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Retrieve Connection Credentials

Once your project is created, you need to gather three pieces of information:

### 2.1 Get the Supabase URL and Anon Key

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon (public) Key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2.2 Get the Service Role Key

1. Still in **Settings** → **API**
2. Under "Project API keys", find the **Service Role Key** (secret)
3. Copy this value as your `SUPABASE_SERVICE_ROLE_KEY`
4. **⚠️ Important**: Keep this key secret. Never commit it to version control.

## Step 3: Enable pgvector Extension

The EMET platform uses pgvector for vector embeddings. Enable it:

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Run the following SQL:

```sql
create extension if not exists vector;
```

4. Click "Run"

## Step 4: Create Database Schema

1. In the **SQL Editor**, click "New Query"
2. Copy and paste the entire contents of the database schema file
3. Click "Run" to create all tables and functions

The schema creates these tables:
- `users` - Wallet-based accounts, roles, reputation
- `products` - Marketplace items (AWG, solar, food, housing)
- `proposals` - DAO governance proposals
- `votes` - One vote per user per proposal
- `content` - Content publishing pipeline (tweet/meme/blog/video)
- `channels` - Messaging channels (public/private/dm)
- `messages` - Chat messages linked to channels
- `news_alerts` - Threat-level news items by category
- `legal_documents` - RAG documents with vector(1536) embeddings (pgvector)
- `uploaded_documents` - User PDF/doc uploads with processing status
- `audit_log` - Immutable SHA-256 hash-chained audit log
- `kill_switch_votes` - Emergency shutdown votes

Plus views: `active_proposals`, `user_rankings`

## Step 5: Configure Environment Variables

1. In the EMET platform root directory, copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` in your editor

3. Update these variables with values from your Supabase project:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. Fill in other required environment variables:
   - AI provider keys (Groq, Google, OpenAI, Anthropic)
   - Solana RPC URL and network
   - JWT secret (use a random 32+ character string)

## Step 6: Set Up Row Level Security (RLS) Policies

Row Level Security protects data by ensuring users can only access their own data:

1. Go to **Authentication** → **Policies** in your Supabase dashboard
2. For each table that needs RLS:
   - Click on the table name
   - Enable "RLS" (Row Level Security)
   - Create policies based on the schema SQL

Common policy patterns:
- `users` table: Users can only read/update their own record
- `conversations` table: Users can only access their own conversations
- `agents` table: Users can only access agents they created

Example policy SQL:

```sql
-- Allow users to read only their own data
CREATE POLICY "Users can read own data"
ON conversations
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own data
CREATE POLICY "Users can insert own data"
ON conversations
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

## Step 7: Test the Connection

1. Start the EMET platform development server:
   ```bash
   npm run dev
   ```

2. The app should load without Supabase connection errors

3. Test authentication by:
   - Signing up a new account
   - Creating an agent
   - Starting a conversation

## Troubleshooting

### "Missing environment variables" error
- Verify all three Supabase keys are in `.env.local`
- Check that keys don't have leading/trailing spaces
- Restart the development server after updating `.env.local`

### "pgvector not available" error
- Ensure you ran the `create extension if not exists vector;` SQL
- Verify the extension is enabled in your Supabase project

### "Permission denied" errors
- Check Row Level Security policies are correctly configured
- Verify the user is authenticated
- Check the `auth.uid()` is correctly referenced in policies

### Connection timeout
- Verify the Supabase URL is correct
- Check your internet connection
- Try using the Supabase URL without trailing slashes

### Schema creation fails
- Run each SQL statement individually to identify which one fails
- Check for naming conflicts with existing tables
- Verify you have the correct permissions in the project

## Development vs Production

### Development Environment
- Use the credentials created in these steps
- It's safe to use placeholder values during development
- Keep `.env.local` in `.gitignore`

### Production Environment
- Create a separate Supabase project for production
- Use strong, randomly generated passwords
- Enable additional security features (IP whitelisting, etc.)
- Store environment variables securely (e.g., in your hosting platform)
- Enable backups and point-in-time recovery
- Review and test all RLS policies thoroughly

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/installing)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgvector Documentation](https://github.com/pgvector/pgvector)

## Support

If you encounter issues:
1. Check the Supabase dashboard logs under **Settings** → **Logs**
2. Review the browser console for error messages
3. Check the EMET platform documentation
4. Visit the [Supabase Discord community](https://discord.supabase.com)
