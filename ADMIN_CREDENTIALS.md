# Admin Credentials Management

## Current Setup

The admin password is stored in the `.env` file and can be managed using the provided script.

## Default Credentials

- **Username**: Admin (no username required, password only)
- **Default Password**: `admin123`

## Change Admin Password

### Method 1: Using the Script (Recommended)

```bash
# Interactive mode - prompts for password
pnpm admin:password

# Direct mode - provide password as argument
pnpm admin:password "your-new-password"
```

### Method 2: Manual Edit

1. Open `.env` file
2. Find or add the line: `ADMIN_PASSWORD=your-password-here`
3. Save the file
4. Restart the dev server

## Environment Variable

The admin password is configured via:

```env
ADMIN_PASSWORD=admin123
```

This is exposed to the client via `nuxt.config.ts` runtime config:

```typescript
runtimeConfig: {
  public: {
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123'
  }
}
```

## Security Best Practices

### Development

- ✅ Use a simple password like `admin123` for local development
- ✅ Keep `.env` in `.gitignore` (already configured)
- ✅ Share `.env.example` with your team (without actual passwords)

### Production

- ⚠️ **IMPORTANT**: The current implementation stores passwords in plain text and is **NOT suitable for production**
- 🔒 For production, you should implement:
  - Proper authentication with hashed passwords
  - JWT tokens or session management
  - Database-backed user accounts
  - OAuth/SSO integration
  - Rate limiting on login attempts

## Production-Ready Authentication

For a production application, consider:

1. **Nuxt Auth** - https://auth.nuxtjs.org/
2. **NextAuth.js** - https://next-auth.js.org/
3. **Supabase Auth** - https://supabase.com/docs/guides/auth
4. **Auth0** - https://auth0.com/
5. **Custom JWT implementation** with bcrypt password hashing

## Current Implementation

The current auth system is in:
- `app/composables/useAuth.ts` - Authentication logic
- `app/middleware/auth.ts` - Route protection
- `nuxt.config.ts` - Runtime config

## Accessing Admin Panel

1. Go to http://localhost:3000
2. Click "Admin Login" button
3. Enter the password (default: `admin123`)
4. You'll be redirected to `/admin` dashboard

## Troubleshooting

### Password not working after change

1. Make sure you saved the `.env` file
2. Restart the dev server: `pnpm dev`
3. Clear browser cache/cookies
4. Check the `.env` file has the correct format: `ADMIN_PASSWORD=yourpassword`

### Can't access admin panel

1. Verify you're logged in (check if "Sign out" button is visible)
2. Try logging out and logging in again
3. Check browser console for errors
4. Verify middleware is working: check `app/middleware/auth.ts`

## Script Usage Examples

```bash
# View current password and set new one interactively
pnpm admin:password

# Set password directly
pnpm admin:password "MySecurePass123"

# Set a complex password
pnpm admin:password "P@ssw0rd!2024#Secure"
```

## Notes

- Minimum password length: 6 characters
- No special character requirements (for development ease)
- Password is case-sensitive
- No username required (password-only authentication)
