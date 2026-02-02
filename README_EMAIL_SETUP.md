# Email Setup Instructions

This guide will help you configure SMTP email functionality for the contact form.

## Prerequisites

1. A Gmail account or Google Workspace account
2. 2-Step Verification enabled on your Google account

## Step 1: Install Dependencies

Navigate to the Backend directory and install the required packages:

```bash
cd Backend
pip install -r requirements.txt
```

The Python backend includes the required SMTP/email utilities (no additional `nodemailer` dependency).

## Step 2: Generate App Password

### For Gmail:

1. Go to your [Google Account](https://myaccount.google.com/)
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", enable **2-Step Verification** if not already enabled
4. After enabling 2-Step Verification, go back to Security
5. Click on **2-Step Verification** again
6. Scroll down and click on **App passwords**
7. Select **Mail** as the app and **Other (Custom name)** as the device
8. Enter "GNS Software Backend" as the name
9. Click **Generate**
10. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### For Google Workspace:

Follow the same steps as Gmail. The process is identical.

## Step 3: Configure Environment Variables

1. Create a `.env` file in the `Backend` directory (copy from `.env.example` if it exists)
2. Add the following configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password

# Contact Email (where form submissions will be sent)
CONTACT_EMAIL=info@gnssoftware.in
```

### Important Notes:

- **SMTP_USER**: Your Gmail address (e.g., `info@gnssoftware.in` or `yourname@gmail.com`)
- **SMTP_PASSWORD**: The 16-character app password you generated (remove spaces if any)
- **SMTP_HOST**: Use `smtp.gmail.com` for Gmail/Google Workspace
- **SMTP_PORT**: 
  - `587` for TLS (recommended)
  - `465` for SSL (set `SMTP_SECURE=true` if using this port)
- **CONTACT_EMAIL**: The email address where you want to receive contact form submissions

## Step 4: Test the Configuration

1. Start the backend server:

```bash
cd Backend
uvicorn app.main:app --reload --port 5000
```

2. The server should start on `http://localhost:5000`

3. Test the contact form by submitting a test message from the frontend

4. Check your email inbox (info@gnssoftware.in) for the test message

## Troubleshooting

### Error: "Invalid login"

- Make sure you're using an **App Password**, not your regular Gmail password
- Verify the app password doesn't have spaces
- Ensure 2-Step Verification is enabled

### Error: "Connection timeout"

- Check your firewall settings
- Verify the SMTP_HOST and SMTP_PORT are correct
- Try using port 465 with SMTP_SECURE=true

### Error: "Authentication failed"

- Regenerate the app password
- Make sure you copied the entire 16-character password correctly
- Verify your email address is correct

### Emails not received

- Check spam/junk folder
- Verify CONTACT_EMAIL is set correctly
- Check backend server logs for error messages
- Ensure the backend server is running

## Production Deployment

For production:

1. Set `NODE_ENV=production`
2. Use environment variables provided by your hosting platform
3. Consider using a dedicated email service (SendGrid, Mailgun, etc.) for better deliverability
4. Set `SMTP_SECURE=true` and use port 465 for SSL if your hosting requires it

## Security Notes

- Never commit the `.env` file to version control
- Keep your app password secure
- Rotate app passwords periodically
- Use environment variables in production

## Alternative SMTP Providers

If you prefer not to use Gmail, you can configure other SMTP providers:

### SendGrid:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

### Mailgun:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
```

### Outlook/Office 365:
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```
