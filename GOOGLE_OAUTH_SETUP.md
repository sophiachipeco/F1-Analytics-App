# Google OAuth Setup Guide

This document explains how to set up Google OAuth 2.0 for the F1 Analytics App.

## Overview

The application now supports both:
1. **Credentials Authentication**: Traditional email/password login
2. **Google OAuth 2.0**: Sign in with your Google account

## Backend Implementation

### New OAuth Endpoint

A new endpoint has been added to handle Google OAuth:

```
POST /users/oauth-login
```

**Parameters:**
- `email` (string): User's email from Google account
- `display_name` (string): User's display name
- `avatar_url` (string, optional): User's profile picture URL
- `provider` (string): OAuth provider name (default: "google")
- `provider_id` (string, optional): Provider's unique user ID

**Behavior:**
- Checks if user exists by email
- Creates new user if doesn't exist
- Updates avatar if user exists without one
- Returns user info in response

### Files Modified

**app/controllers/auth.py**
- Added `POST /users/oauth-login` endpoint
- Handles user creation for new OAuth accounts
- Merges existing accounts with OAuth

## Frontend Implementation

### NextAuth Configuration

Updated `app/api/auth/[...nextauth]/route.ts` with:

```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
})
```

And a `signIn` callback that:
- Routes OAuth flows to backend `/users/oauth-login`
- Extracts user email, name, and profile picture
- Returns success/failure status

### Updated Pages

**app/login/page.tsx**
- Added Google sign-in button
- Added visual divider between email/password and OAuth methods
- Handles OAuth errors

**app/signup/page.tsx**
- Added Google sign-up button
- Users can sign up directly with Google without creating credentials

### Environment Variables

Updated `.env.local` with Google OAuth credentials placeholders:
```
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

## Google Cloud Setup (Required)

To enable Google OAuth, you must create a Google Cloud project and generate OAuth 2.0 credentials.

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" at the top
3. Click "NEW PROJECT"
4. Enter project name: `F1-Analytics-App` (or your preference)
5. Click "CREATE"
6. Wait for project creation to complete

### Step 2: Enable Google+ API

1. In Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API" (or "People API")
3. Click the result and select "ENABLE"

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth Client ID"
3. If prompted to create a consent screen first:
   - Choose "External" user type
   - Fill in app name: "F1 Analytics App"
   - Add your email as support contact
   - Add any necessary scopes
   - Click through to create
4. Return to Credentials and click "Create Credentials" > "OAuth Client ID" again
5. Choose application type: **Web application**
6. Name it: `F1 Analytics Local Dev`
7. Add Authorized JavaScript Origins:
   - `http://localhost:3000`
   - `http://localhost:8000` (for development)
8. Add Authorized Redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
9. Click "CREATE"
10. Copy the **Client ID** and **Client Secret**

### Step 4: Update Environment Variables

In `frontend/.env.local`, update:

```env
GOOGLE_CLIENT_ID=your-copied-client-id-here
GOOGLE_CLIENT_SECRET=your-copied-client-secret-here
```

Replace the placeholder values with your actual Google OAuth credentials.

### Step 5: Restart the Development Server

```bash
# If running Next.js locally
npm run dev

# If using Docker (already running)
docker compose restart
```

## Testing Google OAuth

1. Open the app at `http://localhost:3000`
2. Go to **Login** page
3. Click the **"Sign in with Google"** button
4. Google login screen should appear
5. Sign in with your Google account
6. You should be redirected to the dashboard

### New Users

For new Google accounts:
- A new user is created automatically
- Display name comes from Google account
- Profile picture is fetched from Google
- No password is set (OAuth users use Google login)

### Existing Users

For accounts that already exist:
- You can link your Google OAuth to existing email accounts
- Just sign in with Google using the same email
- Your profile picture will be updated if empty

## Troubleshooting

### "Invalid Client ID" Error
- Verify `GOOGLE_CLIENT_ID` is correctly copied in `.env.local`
- Check that the value doesn't have extra spaces or quotes
- Restart the Next.js dev server after updating

### "Redirect URI mismatch" Error
- Verify `http://localhost:3000/api/auth/callback/google` is in your Google Cloud credentials
- Check that your callback endpoint is exactly `http://localhost:3000` not `localhost`
- Capitals matter in URIs

### OAuth Button Not Showing
- Ensure `GOOGLE_CLIENT_ID` is set in `.env.local`
- Verify `.env.local` is loaded by restarting dev server
- Check browser console for errors

### User Created But Can't Log Back In
- Make sure you're using the same Google account
- Check that email matches in database
- Backend OAuth endpoint creates users on first login

## Security Notes

1. **Never commit credentials to git** - Use `.env.local` which is gitignored
2. **Client Secret** - Keep this private, only used on backend
3. **Production Setup** - Add production Google Cloud credentials and URIs
4. **NEXTAUTH_SECRET** - Change this in production (used in `.env.local`)

## Disabling Google OAuth (Optional)

To disable Google OAuth:
1. Remove `GoogleProvider` from `app/api/auth/[...nextauth]/route.ts`
2. Users can still use email/password credentials
3. The buttons on login/signup pages will disappear

## Additional Resources

- [NextAuth.js Google Provider Documentation](https://next-auth.js.org/providers/google)
- [Google Cloud OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Callbacks Documentation](https://next-auth.js.org/configuration/callbacks)

---

**Status**: ✅ Backend OAuth endpoint implemented and deployed
**Next Steps**: Set up Google Cloud credentials and test the OAuth flow
