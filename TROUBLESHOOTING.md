# SMTP Authentication Troubleshooting

## Common Issues and Solutions

### Issue: "SMTP authentication failed"

This error means Gmail is rejecting your credentials. Here are the most common causes:

### 1. Wrong Email Address
**Problem:** The email in `SMTP_USER` doesn't match the email used to generate the App Password.

**Solution:**
- The App Password must be generated for the SAME email address you use in `SMTP_USER`
- If you generated the App Password for `yourname@gmail.com`, then `SMTP_USER` must be `yourname@gmail.com`
- If you generated it for `info@gnssoftware.in`, then `SMTP_USER` must be `info@gnssoftware.in`

### 2. Using Regular Password Instead of App Password
**Problem:** You're using your regular Gmail password instead of an App Password.

**Solution:**
- You MUST use an App Password, not your regular password
- Generate a new App Password: https://myaccount.google.com/apppasswords
- Make sure 2-Step Verification is enabled first

### 3. App Password Expired or Revoked
**Problem:** The App Password was deleted or revoked.

**Solution:**
- Generate a new App Password
- Update the `.env` file with the new password
- Restart the server

### 4. Spaces in Password
**Problem:** Gmail shows App Passwords with spaces, but they should be used without spaces.

**Solution:**
- The code now automatically removes spaces, but double-check your `.env` file
- Password should be 16 characters with no spaces: `abcdefghijklmnop`

### 5. Server Not Restarted
**Problem:** You updated `.env` but didn't restart the server.

**Solution:**
- Stop the server (Ctrl+C)
- Restart: `uvicorn app.main:app --reload --port 5000`
- The server loads `.env` only when it starts

### 6. Google Workspace Account Issues
**Problem:** For Google Workspace accounts, admin may need to enable "Less secure app access" or allow app passwords.

**Solution:**
- Contact your Google Workspace admin
- Or use a personal Gmail account for testing

## Step-by-Step Verification

1. **Verify your .env file:**
   ```env
   SMTP_USER=info@gnssoftware.in
   SMTP_PASSWORD=your16characterpassword
   ```
   - No spaces in password
   - Email matches the one used for App Password

2. **Verify App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Make sure the App Password exists and is for "Mail"
   - If it doesn't exist, create a new one

3. **Test with a simple email:**
   - Try sending a test email from the contact form
   - Check the backend console for detailed error messages

4. **Check backend logs:**
   - Look at the terminal where the server is running
   - Error messages will show exactly what Gmail rejected

## Alternative: Use a Different Email Service

If Gmail continues to cause issues, you can use:

### SendGrid (Free tier available):
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

### Mailgun (Free tier available):
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
```

## Still Not Working?

1. Check the backend server console for the exact error message
2. Verify the email address matches the App Password account
3. Try generating a fresh App Password
4. Make sure 2-Step Verification is enabled
5. Restart the server after any .env changes
