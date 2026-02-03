# Production Deployment Guide

## Quick Setup (5 minutes)

### 1. Build the Frontend
```bash
npm run build
```

### 2. Start the Backend
```bash
cd server
npm install  # if not already done
NODE_ENV=production npm start &
```

### 3. Configure Nginx
```bash
# Copy the nginx config
sudo cp nginx.conf /etc/nginx/sites-available/portfolio

# Enable the site
sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/

# Test the configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 4. Access Your Site
Your site will be available at `http://your-server-ip` or your domain name.

---

## Alternative: Use the Production Script

```bash
# Make it executable
chmod +x start-prod.sh

# Run it
./start-prod.sh
```

Then follow steps 3 above to configure nginx.

---

## Using PM2 (Recommended for Production)

For better process management:

```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
cd server
pm2 start index.js --name "portfolio-backend"
pm2 save
pm2 startup  # Follow the instructions to enable auto-start

# Monitor
pm2 status
pm2 logs portfolio-backend
```

---

## Environment Variables

Make sure to create a `.env` file in the `/server` directory:

```bash
cd server
cp .env.example .env  # if you have an example file
# or create it manually with your production values
```

Required variables:
- `JWT_SECRET` - For authentication
- `EMAIL_USER` - For contact form
- `EMAIL_PASS` - Email password
- `PORT` - Backend port (default: 5000)

---

## Firewall Setup

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Or manually
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

---

## SSL/HTTPS Setup (Optional but Recommended)

Using Let's Encrypt:

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
sudo certbot renew --dry-run
```

---

## Troubleshooting

### Check if backend is running
```bash
curl http://localhost:5000/api/health
# or
ps aux | grep node
```

### Check nginx status
```bash
sudo systemctl status nginx
sudo nginx -t
```

### View logs
```bash
# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Backend logs (if using PM2)
pm2 logs portfolio-backend
```

### Permissions for uploads
```bash
# Make sure nginx can read uploads
chmod 755 server/uploads
chmod 644 server/uploads/**/*
```

---

## File Structure in Production

```
/home/kai/Documents/model/
├── dist/              # Built frontend (served by nginx)
├── server/            # Backend
│   ├── index.js
│   ├── uploads/       # User uploaded files
│   └── ...
├── nginx.conf         # Nginx configuration
└── start-prod.sh      # Production startup script
```

---

## Maintenance

### Update the site
```bash
# Pull latest changes
git pull

# Rebuild frontend
npm run build

# Restart backend (if using PM2)
pm2 restart portfolio-backend

# Reload nginx
sudo systemctl reload nginx
```

### Backup
```bash
# Backup uploads and database
tar -czf backup-$(date +%Y%m%d).tar.gz server/uploads server/data
```
