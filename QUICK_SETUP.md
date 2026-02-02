# Quick SMTP Setup Guide

## The Error You're Seeing

If you see "Failed to send email", it means the SMTP configuration is not set up correctly.

## Quick Fix (5 minutes)

### Step 1: Generate Gmail App Password

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App passwords**: https://myaccount.google.com/apppasswords
4. Select:
   - App: **Mail**
   - Device: **Other (Custom name)**
   - Name: **GNS Software Backend**
5. Click **Generate**
6. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

### Step 2: Update .env File

1. Open `Backend/.env` file
2. Find this line:
   ```
   SMTP_PASSWORD=your-app-password-here
   ```
3. Replace `your-app-password-here` with your **16-character app password** (remove spaces if any)
4. Make sure `SMTP_USER` is set to your email:
   ```
   SMTP_USER=info@gnssoftware.in
   ```
   (or your Gmail address if using a personal Gmail)

### Step 3: Restart Backend Server

1. Stop the current server (Ctrl+C in the terminal)
2. Start it again:
   ```bash
   cd Backend
   uvicorn app.main:app --reload --port 5000
   ```

### Step 4: Test

1. Go to your contact form
2. Submit a test message
3. Check your email inbox (info@gnssoftware.in)

## Example .env File

```env
PORT=5000
NODE_ENV=development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@gnssoftware.in
SMTP_PASSWORD=abcdefghijklmnop
CONTACT_EMAIL=info@gnssoftware.in
```

**Important:** 
- Use the **App Password**, NOT your regular Gmail password
- Remove any spaces from the app password
- The app password is 16 characters long

## Still Having Issues?

Check the backend server console for detailed error messages. They will tell you exactly what's wrong.

Common issues:
- ❌ "SMTP authentication failed" → Wrong password or not using App Password
- ❌ "SMTP credentials are not configured" → Still using placeholder values in .env
- ❌ "Could not connect to SMTP server" → Check SMTP_HOST and SMTP_PORT
