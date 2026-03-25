# Deployment Guide - CodeReview API

Your FastAPI server is now ready to deploy to the cloud! Here are the recommended options:

## Option 1: **Render** (Recommended - Free & Easiest) ⭐

### Steps:

1. **Push your code to GitHub** (required for Render)
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin auth
   ```

2. **Create a Render account** at https://render.com (sign up with GitHub)

3. **Create a MySQL database** (if you don't have one already)
   - Use **PlanetScale** (free MySQL) at https://planetscale.com
   - Or **Railway** or **Heroku PostgreSQL**

4. **Deploy on Render:**
   - Go to https://render.com/dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Set the following:
     - **Name:** codereview-api
     - **Environment:** Python 3.11
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `uvicorn data.querys.main:app --host 0.0.0.0 --port $PORT`

5. **Add Environment Variables** in Render dashboard:
   ```
   DB_USER=<your_db_user>
   DB_PASSWORD=<your_db_password>
   DB_HOST=<your_db_host>
   DB_NAME=<your_db_name>
   FRONTEND_URL=<your_frontend_url>
   ```

6. **Deploy** - Render will automatically deploy from your GitHub repo

Your API will be live at: `https://codereview-api.onrender.com`

---

## Option 2: **Railway** (Also Free)

1. Go to https://railway.app
2. Connect your GitHub repo
3. Add a service for your FastAPI app
4. Add MySQL database service
5. Set the same environment variables
6. Deploy!

---

## Option 3: **PythonAnywhere** (Python-specific)

1. Go to https://www.pythonanywhere.com
2. Upload your code or connect GitHub
3. Configure the WSGI file
4. Add MySQL credentials
5. Reload the web app

---

## Database Setup

### Using PlanetScale (Free MySQL):
1. Sign up at https://planetscale.com
2. Create a database
3. Get connection details
4. Copy credentials to `DB_*` environment variables

### Using Railway:
1. Add MySQL service in Railway
2. It automatically generates connection details
3. Use those for your environment variables

---

## Testing Your Deployment

Once deployed, test your API:

```bash
# Replace with your deployment URL
curl https://codereview-api.onrender.com/docs

# Test an endpoint
curl https://codereview-api.onrender.com/api/tasks/users/testuser
```

You can also visit the interactive docs at: `https://codereview-api.onrender.com/docs`

---

## Local Development with Environment Variables

Create a `.env` file locally (use `.env.example` as a template):
```
DB_USER=root
DB_PASSWORD=root
DB_HOST=localhost
DB_NAME=db
```

Then run:
```bash
pip install -r requirements.txt
uvicorn data.querys.main:app --reload
```

---

## Production Checklist

- ✅ Environment variables configured
- ✅ CORS settings updated
- ✅ Database connection uses env vars
- ✅ requirements.txt created
- ✅ Code pushed to GitHub
- ✅ Deployment platform selected
- ✅ Database hosted in cloud
- ✅ Tested all endpoints

Once deployed, your API will be accessible from **anywhere in the world** without any installation needed! 🌍
