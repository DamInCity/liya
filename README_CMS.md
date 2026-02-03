# 🎨 Portfolio Website with CMS

A modern portfolio website with a full-featured content management system built with React, TypeScript, Express, and Nodemailer.

## ✨ Features

### Public Website
- 📧 **Contact Form** - Email and phone number fields with email delivery
- 🎯 **Dynamic Specialties** - Services section managed via CMS
- 📸 **Portfolio Gallery** - Project showcase with multiple images
- 🌓 **Dark/Light Mode** - Theme toggle
- 📱 **Fully Responsive** - Mobile-first design
- ✨ **Smooth Animations** - Framer Motion animations

### Admin CMS
- 🔐 **Secure Login** - JWT authentication
- 📝 **Manage Specialties** - Add, edit, delete services
- 🖼️ **Manage Projects** - Full portfolio management
- 📷 **Image Upload** - Multiple images per project
- 💾 **Simple Database** - JSON-based storage

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- Gmail account (for contact form emails)

### Installation

1. **Clone and install:**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

2. **Configure email (important!):**
   
   Open `server/.env` and update:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   EMAIL_TO=recipient@example.com
   ```
   
   Get Gmail App Password: https://myaccount.google.com/apppasswords

3. **Start both servers:**
   ```bash
   # Option 1: Use the startup script
   ./start.sh
   
   # Option 2: Manual start
   # Terminal 1 - Backend
   cd server && npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

4. **Access the site:**
   - Website: `http://localhost:5174`
   - Admin: `http://localhost:5174/admin/login`
   - Login: `admin` / `admin123`

---

## 📖 Documentation

For detailed setup and usage instructions, see:
- **[Backend/CMS Documentation](server/README.md)** - Complete API reference, endpoints, authentication

---

## 🎯 What's Included

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router

**Backend:**
- Express.js
- Nodemailer (email)
- JWT (authentication)
- Multer (file uploads)
- JSON file database

---

## 📁 Project Structure

```
/
├── src/                    # Frontend React app
│   ├── components/
│   │   ├── admin/         # Admin login & dashboard
│   │   ├── sections/      # Homepage sections
│   │   └── ui/            # Reusable components
│   └── services/
│       └── api.ts         # API client
│
├── server/                # Backend Express API
│   ├── index.js          # Server entry point
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & validation
│   ├── utils/            # Email & storage
│   ├── data/             # JSON database (auto-created)
│   └── uploads/          # Uploaded images (auto-created)
│
├── .env                  # Frontend config
├── server/.env          # Backend config (CONFIGURE THIS!)
└── start.sh             # Startup script
```

---

## 🔐 Admin Panel

### Access
URL: `http://localhost:5174/admin/login`

### Default Credentials
- Username: `admin`
- Password: `admin123`

**⚠️ Change the password immediately after first login!**

### Features
- **Dashboard Overview** - See all content at a glance
- **Specialties Manager** - Add/edit/delete services
- **Projects Manager** - Full portfolio control
- **Image Upload** - Drag & drop support
- **Live Preview** - View changes instantly

---

## 📧 Contact Form Setup

The contact form needs Gmail configuration to work.

### Steps:

1. **Enable 2-Factor Authentication** on your Google Account
   
2. **Generate App Password:**
   - Visit: https://myaccount.google.com/apppasswords
   - Create password for "Mail"
   - Copy the 16-character code

3. **Update `server/.env`:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx  # The 16-char app password
   EMAIL_TO=where-to-receive@gmail.com
   ```

4. **Restart backend server**

5. **Test:**
   - Fill out contact form on website
   - Check recipient inbox
   - Check server logs for errors

---

## 🎨 Customization

### Change Admin Password

1. Start backend: `cd server && npm run dev`
2. Generate new hash:
   ```bash
   curl -X POST http://localhost:5000/api/auth/hash-password \
     -H "Content-Type: application/json" \
     -d '{"password":"your-new-password"}'
   ```
3. Copy the hash from response
4. Update `ADMIN_PASSWORD_HASH` in `server/.env`
5. Restart backend

### Add Default Content

Edit `server/utils/storage.js` to change the default specialties, or add content through the admin panel.

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000
# Kill the process and restart
```

### Contact form not sending emails
- Verify Gmail credentials in `server/.env`
- Check you're using App Password, not regular password
- Ensure 2FA is enabled on Gmail account
- Check server console for error messages

### Can't login to admin
- Default is `admin` / `admin123`
- Clear browser localStorage
- Check backend is running on port 5000

### Database issues
```bash
# Reset database (WARNING: deletes all content)
rm server/data/db.json
# Restart backend - it will recreate with defaults
```

---

## 📦 API Endpoints

### Public
- `GET /api/health` - Health check
- `GET /api/specialties` - Get all specialties
- `GET /api/projects` - Get all projects
- `POST /api/contact` - Send contact form

### Admin (requires JWT token)
- `POST /api/auth/login` - Admin login
- `POST /api/specialties` - Create specialty
- `PUT /api/specialties/:id` - Update specialty
- `DELETE /api/specialties/:id` - Delete specialty
- `POST /api/projects` - Create project
- `POST /api/projects/:id/images` - Add images
- `DELETE /api/projects/:id` - Delete project

See [server/README.md](server/README.md) for complete API documentation.

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Set environment variable: `VITE_API_URL=https://your-backend.com`
3. Deploy `dist/` folder

### Backend (Railway/Heroku/DigitalOcean)
1. Set all environment variables from `server/.env`
2. Use production database (MongoDB/PostgreSQL)
3. Enable HTTPS
4. Set `NODE_ENV=production`

---

## 💡 Tips

- **Backup**: Copy `server/data/db.json` regularly
- **Images**: Stored in `server/uploads/`
- **Security**: Change default admin password!
- **Email**: Test with real addresses
- **CORS**: Configured for localhost, update for production

---

## 🆘 Support

### Common Issues

**"Failed to load resource: 404"**
- Backend not running → `cd server && npm run dev`

**"Email failed to send"**
- Check Gmail configuration in `server/.env`
- Verify App Password is correct

**"Invalid credentials"**
- Username is `admin`, password is `admin123`
- Check browser console for errors

### Check Server Status

```bash
# Backend health
curl http://localhost:5000/api/health

# Specialties
curl http://localhost:5000/api/specialties

# Projects
curl http://localhost:5000/api/projects
```

---

## 📝 License

MIT

---

## 🎯 Next Steps

1. ✅ Start servers
2. ✅ Configure Gmail in `server/.env`
3. ✅ Login to admin panel
4. ✅ Change default password
5. ✅ Add your specialties
6. ✅ Create your first project
7. ✅ Upload images
8. ✅ Test contact form
9. ✅ Deploy to production

---

**Built with ❤️ using React, TypeScript, Express, and Nodemailer**
