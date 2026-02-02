# How to Start the Backend Server

## Quick Start

1. **Navigate to the Backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies (if not already done):**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create a `.env` file** (if not already created) with your SMTP configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   CONTACT_EMAIL=info@gnssoftware.in
   ```

4. **Start the server:**
   ```bash
   uvicorn app.main:app --reload --port 5000
   ```

   Or for production, use a process manager or your host's recommended approach (systemd, Docker, etc.)

5. **Verify the server is running:**
   - You should see: `🚀 Server is running on http://localhost:5000`
   - Open http://localhost:5000 in your browser to see the API welcome message
   - Open http://localhost:5000/api/health to check server health

## Troubleshooting

### Port 5000 already in use
If you get an error that port 5000 is already in use:
- Change the PORT in your `.env` file to a different port (e.g., 5001)
- Update the frontend API URL accordingly

### Missing dependencies
If you see dependency errors:
```bash
cd Backend
pip install -r requirements.txt
```

### SMTP Configuration Errors
- Make sure your `.env` file exists in the Backend directory
- Verify your SMTP credentials are correct
- See `README_EMAIL_SETUP.md` for detailed SMTP setup instructions

## Testing the Contact Form

Once the server is running:
1. Start your frontend (if not already running):
   ```bash
   cd Frontend
   npm run dev
   ```

2. Navigate to the contact page
3. Fill out and submit the contact form
4. Check your email inbox (info@gnssoftware.in) for the submission
