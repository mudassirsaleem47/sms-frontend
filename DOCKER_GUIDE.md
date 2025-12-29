# 🚀 Docker Quick Reference - Urdu Guide

## Rozana Use Karne Ke Commands

### Start/Stop

```bash
# Start karo (logs dikhenge)
docker-compose up

# Background mein start karo
docker-compose up -d

# Stop karo
docker-compose down

# Stop + data delete
docker-compose down -v
```

### Logs Dekhna

```bash
# Sab logs
docker-compose logs

# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# Live logs (follow mode)
docker-compose logs -f backend
```

### Rebuild Karna

```bash
# Sab rebuild
docker-compose up --build

# Specific service rebuild
docker-compose up --build backend

# Fresh start
docker-compose down -v
docker-compose up --build
```

### Status Check

```bash
# Containers ki status
docker-compose ps

# Running containers
docker ps

# All containers (stopped bhi)
docker ps -a
```

---

## Common Problems & Solutions

### Port Already in Use
```bash
# Solution: Service stop karo ya port change karo
docker-compose down
# docker-compose.yml mein port change karo
docker-compose up
```

### MongoDB Connection Error
```bash
# .env check karo
# Docker: mongodb://mongodb:27017/school-management
# Atlas: mongodb+srv://...

docker-compose restart mongodb
```

### Changes Not Reflecting
```bash
docker-compose down
docker-compose up --build
```

### Docker Desktop Not Running
```bash
# Docker Desktop app start karo
# Wait for it to fully start
# Then: docker-compose up
```

---

## URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **MongoDB**: localhost:27017

---

## Environment Variables

### Docker MongoDB (Local)
```env
PORT=5000
MONGO_URL=mongodb://mongodb:27017/school-management
```

### MongoDB Atlas (Cloud)
```env
PORT=5000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/school-management
```

---

## Debugging

```bash
# Container ke andar jao
docker exec -it school-backend sh
docker exec -it school-frontend sh

# Container restart
docker-compose restart backend

# Logs with timestamps
docker-compose logs -f --timestamps backend

# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune
```

---

## First Time Setup

```bash
# 1. Project folder mein jao
cd f:\School-Management-System

# 2. .env file check karo (backend folder mein)
# MONGO_URL=mongodb://mongodb:27017/school-management

# 3. Start karo
docker-compose up

# 4. Browser mein kholo
# http://localhost:5173
```

---

## GitHub Workflow

```bash
# Add files
git add .

# Commit
git commit -m "Add Docker configuration"

# Push
git push origin main

# New machine pe
git clone <repo-url>
cd School-Management-System
docker-compose up
```

---

## Pro Tips

1. **Background run**: `docker-compose up -d`
2. **Specific logs**: `docker-compose logs -f backend`
3. **Quick restart**: `docker-compose restart backend`
4. **Clean slate**: `docker-compose down -v && docker-compose up --build`
5. **Shell access**: `docker exec -it school-backend sh`

---

**Save this file for quick reference! 📌**
