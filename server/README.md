# Portfolio CMS Backend - Complete Setup Guide

A complete Express.js backend with CMS functionality for managing a portfolio website.

## 🎯 What You Get

### Backend Features
- ✅ **Contact Form** - Email sending via Nodemailer
- ✅ **Admin Authentication** - JWT-based login system
- ✅ **Image Management** - Upload, replace, delete images
- ✅ **Specialties/Services** - Full CRUD operations
- ✅ **Portfolio Projects** - Manage projects with multiple images
- ✅ **JSON Database** - Simple file-based storage

### Frontend Features
- ✅ **Admin Login Page** - `/admin/login`
- ✅ **Admin Dashboard** - `/admin/dashboard`
- ✅ **Contact Form** - With email and phone fields
- ✅ **Dynamic Content** - Fetches from backend API

---

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Gmail account (for email sending)

---

## 🚀 Quick Start

### Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

This installs:
- express
- nodemailer
- cors
- dotenv
- bcryptjs
- jsonwebtoken
- multer
- express-validator

### Step 2: Configure Environment Variables

The `.env` file is already created. Update these values:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com          # Change this
EMAIL_PASSWORD=your-gmail-app-password    # Change this
EMAIL_FROM=your-email@gmail.com          # Change this
EMAIL_TO=recipient@example.com           # Change this

# Server
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-key-here    # Change this!

# Admin Credentials (default: admin/admin123)
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$rXqgJZHqQ7XY3vkUE.2KXuWZvF7gP4Z0rF3jPqZ7xDqKvF8nPqZ7x
```

### Step 3: Get Gmail App Password

1. Go to your Google Account: https://myaccount.google.com
2. Enable **2-Factor Authentication** if not already enabled
3. Go to **App Passwords**: https://myaccount.google.com/apppasswords
4. Select "Mail" and your device
5. Copy the 16-character password
6. Paste it as `EMAIL_PASSWORD` in `.env`

### Step 4: Start the Backend

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
📧 Email configured: your-email@gmail.com
✅ Database initialized
```

### Step 5: Start the Frontend

In a new terminal:

```bash
cd ..  # Go back to project root
npm run dev
```

The frontend will start on `http://localhost:5174` (or 5173)

---

## 🔐 Admin Access

### Default Login Credentials
- **URL**: `http://localhost:5174/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

### Change Admin Password

1. Start the backend server
2. Generate a new password hash:
   ```bash
   curl -X POST http://localhost:5000/api/auth/hash-password \
     -H "Content-Type: application/json" \
     -d '{"password":"your-new-secure-password"}'
   ```
3. Copy the returned hash
4. Update `ADMIN_PASSWORD_HASH` in `server/.env`
5. Restart the backend

---

## 📁 Project Structure

```
server/
├── index.js              # Main server file
├── package.json          # Dependencies
├── .env                  # Environment variables
├── data/
│   └── db.json          # JSON database (auto-created)
├── uploads/             # Uploaded files (auto-created)
│   ├── images/
│   └── projects/
├── middleware/
│   └── auth.js          # JWT authentication
├── routes/
│   ├── auth.js          # Login endpoints
│   ├── contact.js       # Contact form
│   ├── images.js        # Image management
│   ├── specialties.js   # Services/specialties CRUD
│   └── projects.js      # Portfolio projects CRUD
└── utils/
    ├── email.js         # Nodemailer configuration
    └── storage.js       # JSON database functions

src/
├── components/
│   ├── admin/
│   │   ├── AdminLogin.tsx      # Login page
│   │   └── AdminDashboard.tsx  # CMS dashboard
│   └── sections/
│       ├── CTASection.tsx      # Contact form
│       ├── ServicesStrip.tsx   # Fetches specialties
│       └── SitesGallery.tsx    # Fetches projects
└── services/
    └── api.ts           # API service functions
```

---

## 🎯 How It Works

### 1. Database (JSON File)

The backend uses a simple JSON file at `server/data/db.json`:

```json
{
  "specialties": [
    {
      "id": "1",
      "title": "Runway",
      "description": "High fashion runway shows",
      "icon": "👗"
    }
  ],
  "projects": [],
  "images": []
}
```

- **Auto-created** on first run with sample data
- **3 default specialties** included
- **Empty projects array** ready for your content

### 2. Authentication Flow

1. User visits `/admin/login`
2. Enters username/password
3. Backend validates credentials
4. Returns JWT token (24h expiry)
5. Token stored in localStorage
6. Used for all protected API calls

### 3. Admin Dashboard

Access at `/admin/dashboard` after login:

- **View all specialties** - See, edit, delete services
- **View all projects** - Manage portfolio items
- **Add new content** - Create specialties/projects
- **Manage images** - Upload and organize media

---

## 🔌 API Endpoints

### Public Endpoints (No Auth Required)

#### Health Check
```bash
GET /api/health
```

#### Contact Form
```bash
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "Hello!"
}
```

#### Get Specialties
```bash
GET /api/specialties
```

#### Get Projects
```bash
GET /api/projects
```

### Protected Endpoints (Auth Required)

Add header: `Authorization: Bearer YOUR_TOKEN`

#### Create Specialty
```bash
POST /api/specialties
Content-Type: application/json

{
  "title": "New Service",
  "description": "Service description",
  "icon": "🎨"
}
```

#### Update Specialty
```bash
PUT /api/specialties/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### Delete Specialty
```bash
DELETE /api/specialties/:id
```

#### Create Project (with images)
```bash
POST /api/projects
Content-Type: multipart/form-data

title: "Fashion Campaign"
description: "Description here"
category: "Editorial"
tags: "fashion,luxury"
images: [file1, file2, file3]
```

#### Add Images to Project
```bash
POST /api/projects/:id/images
Content-Type: multipart/form-data

images: [file1, file2]
```

#### Delete Project Image
```bash
DELETE /api/projects/:projectId/images/:imageId
```

#### Delete Project
```bash
DELETE /api/projects/:id
```

---

## 📧 Testing Email

### Test Contact Form

1. Make sure `.env` has valid Gmail credentials
2. Visit your site: `http://localhost:5174`
3. Scroll to contact section
4. Fill form with email, phone, message
5. Click "Send Message"
6. Check your inbox!

### Test via cURL

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "message": "This is a test message"
  }'
```

---

## 🎨 Using the Admin Dashboard

### 1. Login
1. Go to `http://localhost:5174/admin/login`
2. Enter `admin` / `admin123`
3. Click "Sign In"

### 2. Manage Specialties
1. Click "Specialties" tab
2. See list of all services
3. Click "+ Add Specialty" to create new
4. Click "Edit" to modify existing
5. Click "Delete" to remove

### 3. Manage Projects
1. Click "Projects" tab
2. See all portfolio items
3. Click "+ Add Project" to create
4. Upload multiple images per project
5. Add title, description, category, tags
6. Edit or delete projects anytime

### 4. View Changes
- Click "View Site" to see live site
- Changes appear immediately
- No page refresh needed

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process if needed
kill -9 <PID>

# Restart
cd server && npm run dev
```

### Email not sending
- ✅ Check Gmail credentials in `.env`
- ✅ Ensure 2FA is enabled on Gmail
- ✅ Use App Password, not regular password
- ✅ Check `EMAIL_TO` is correct
- ✅ Look at server logs for errors

### Can't login to admin
- ✅ Check `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH`
- ✅ Default is `admin` / `admin123`
- ✅ Generate new hash if needed
- ✅ Clear browser localStorage
- ✅ Check browser console for errors

### Frontend not loading data
- ✅ Ensure backend is running on port 5000
- ✅ Check `.env` has `VITE_API_URL=http://localhost:5000`
- ✅ Open browser console for errors
- ✅ Test API directly: `curl http://localhost:5000/api/health`

### Database issues
- ✅ Delete `server/data/db.json` and restart
- ✅ It will recreate with sample data
- ✅ Check file permissions

---

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Change admin password
4. Use real database (MongoDB/PostgreSQL)
5. Enable HTTPS
6. Set up rate limiting
7. Configure CORS properly

### Frontend
1. Build: `npm run build`
2. Update `VITE_API_URL` to production URL
3. Deploy to Vercel/Netlify/etc

---

## 📚 Next Steps

1. **Change default password** - Security first!
2. **Configure Gmail** - Enable email sending
3. **Add your content** - Create projects and specialties
4. **Upload images** - Add your portfolio photos
5. **Customize** - Modify styles and content
6. **Deploy** - Share with the world!

---

## 💡 Tips

- Database is just JSON - easy to backup
- Images stored in `uploads/` folder
- JWT tokens expire after 24 hours
- CORS enabled for local development
- All routes are RESTful

---

## 🆘 Need Help?

Common issues:
1. Port already in use → Change PORT in `.env`
2. Module not found → Run `npm install`
3. Email fails → Check Gmail app password
4. Can't access admin → Check URL is `/admin/login`

Still stuck? Check the server logs for detailed error messages.

---
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASSWORD=your-gmail-app-password
     EMAIL_FROM=your-email@gmail.com
     EMAIL_TO=recipient@example.com

     # Server
     PORT=5000

     # Security
     JWT_SECRET=your-super-secret-key-here
     
     # Admin Login (default: admin/admin123)
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD_HASH=$2a$10$rXqgJZHqQ7XY3vkUE.2KXuWZvF7gP4Z0rF3jPqZ7xDqKvF8nPqZ7x
     ```

4. **Generate a new admin password hash** (recommended):
   ```bash
   # Start the server in development mode
   npm run dev
   
   # In another terminal, generate a hash for your password:
   curl -X POST http://localhost:5000/api/auth/hash-password \
     -H "Content-Type: application/json" \
     -d '{"password":"your-new-password"}'
   
   # Copy the returned hash and update ADMIN_PASSWORD_HASH in .env
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the project root:
   ```bash
   cd ..
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. The frontend `.env` is already configured to connect to `http://localhost:5000`

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Using the CMS

### Admin Login
The CMS requires authentication. Default credentials:
- **Username**: `admin`
- **Password**: `admin123` (change this immediately!)

### API Endpoints

#### Authentication
- `POST /api/auth/login` - Login and receive JWT token
- `POST /api/auth/hash-password` - Generate password hash (dev only)

#### Contact Form
- `POST /api/contact` - Send contact form email

#### Specialties/Services
- `GET /api/specialties` - Get all specialties
- `POST /api/specialties` - Create new specialty (auth required)
- `PUT /api/specialties/:id` - Update specialty (auth required)
- `DELETE /api/specialties/:id` - Delete specialty (auth required)

#### Portfolio Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project with images (auth required)
- `PUT /api/projects/:id` - Update project info (auth required)
- `POST /api/projects/:id/images` - Add images to project (auth required)
- `DELETE /api/projects/:projectId/images/:imageId` - Delete single image (auth required)
- `DELETE /api/projects/:id` - Delete entire project (auth required)

#### Images
- `GET /api/images` - Get all images
- `POST /api/images` - Upload new image (auth required)
- `PUT /api/images/:id` - Update image metadata (auth required)
- `POST /api/images/replace/:id` - Replace image file (auth required)
- `DELETE /api/images/:id` - Delete image (auth required)

### Using the API with Authentication

1. **Login** to get a token:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

2. **Use the token** in subsequent requests:
   ```bash
   curl -X POST http://localhost:5000/api/specialties \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -d '{"title":"New Specialty","description":"Description here","icon":"🎨"}'
   ```

### Example: Adding a Project with Images

```bash
# Using form-data for file upload
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=New Campaign" \
  -F "description=Amazing photoshoot" \
  -F "category=Editorial" \
  -F "tags=fashion,luxury" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

## Gmail Configuration

To use Gmail for sending emails:

1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
3. Use this app password as `EMAIL_PASSWORD` in `.env`

## Data Storage

The backend uses JSON files for data storage:
- Database: `server/data/db.json`
- Uploaded images: `server/uploads/`

For production, consider migrating to a proper database (MongoDB, PostgreSQL, etc.)

## Security Notes

⚠️ **Important for Production:**
- Change the default admin password immediately
- Use a strong `JWT_SECRET`
- Use HTTPS in production
- Implement rate limiting
- Add proper input validation
- Set up proper CORS configuration
- Store sensitive data in environment variables
- Use a proper database instead of JSON files
- Set up proper file upload limits and validation

## Development

Both frontend and backend support hot-reload during development:
- Frontend changes will auto-reload in the browser
- Backend changes will auto-restart via nodemon

## Building for Production

### Frontend
```bash
npm run build
```

### Backend
```bash
cd server
npm start
```

Make sure to update `VITE_API_URL` in the frontend `.env` to point to your production backend URL.

## Troubleshooting

### Email not sending
- Verify Gmail credentials and app password
- Check if 2FA is enabled
- Review `server/.env` configuration
- Check server logs for error messages

### Images not loading
- Ensure backend server is running
- Check that `VITE_API_URL` matches your backend URL
- Verify uploaded files exist in `server/uploads/`

### Authentication errors
- Ensure JWT_SECRET is set in backend `.env`
- Check that token hasn't expired (24h default)
- Verify credentials are correct
