# 🏫 School Management System

Complete school management solution with React frontend, Express backend, and MongoDB database.

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- Git installed

### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/mudassirsaleem47/School-Management-System.git
cd School-Management-System

# 2. Start all services
docker-compose up

# 3. Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
# MongoDB: localhost:27017
```

**That's it! 🎉** Your complete environment is ready!

---

## 📋 Docker Commands (Urdu Guide)

### Basic Commands

```bash
# Sab services start karo
docker-compose up

# Background mein run karo
docker-compose up -d

# Services stop karo
docker-compose down

# Logs dekho
docker-compose logs

# Specific service ki logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Services rebuild karo (code change ke baad)
docker-compose up --build

# Containers ki status check karo
docker-compose ps
```

### Development Workflow

```bash
# 1. Code edit karo (VS Code mein)
# Changes automatically reload honge! ✨

# 2. Agar package.json change kiya toh rebuild karo
docker-compose down
docker-compose up --build

# 3. Database reset karna ho toh
docker-compose down -v  # Volumes bhi delete honge
docker-compose up
```

### Troubleshooting

```bash
# Agar koi error aaye toh:

# 1. Sab containers stop karo
docker-compose down

# 2. Volumes bhi clean karo
docker-compose down -v

# 3. Fresh start karo
docker-compose up --build

# 4. Specific service restart karo
docker-compose restart backend
docker-compose restart frontend
```

---

## 🔧 Environment Configuration

### Backend Environment (.env)

Docker ke saath use karne ke liye `backend/.env` file mein:

```env
PORT=5000
MONGO_URL=mongodb://mongodb:27017/school-management
```

> **Note**: Docker mein MongoDB ka URL `mongodb://mongodb:27017` hoga (service name use hota hai)

### Production/Cloud MongoDB

Agar MongoDB Atlas use karna hai:

```env
PORT=5000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/school-management
```

---

## 📁 Project Structure

```
School-Management-System/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   ├── Dockerfile           # Frontend container config
│   └── package.json
├── backend/                 # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── Dockerfile          # Backend container config
│   ├── .env                # Environment variables
│   └── package.json
├── docker-compose.yml      # Services orchestration
└── .dockerignore          # Docker build optimization
```

---

## 🌐 Without Docker (Manual Setup)

Agar Docker nahi use karna chahte:

### Backend Setup
```bash
cd backend
npm install
# Update .env with local MongoDB URL
# MONGO_URL=mongodb://localhost:27017/school-management
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### MongoDB
- Local MongoDB install karo ya
- MongoDB Atlas use karo

---

## 🎯 Features

- ✅ Student Management
- ✅ Teacher Management
- ✅ Class Management
- ✅ Fee Management
- ✅ Exam & Marks Management
- ✅ Income & Expense Tracking
- ✅ Multi-school Support
- ✅ Responsive Design

---

## 🔥 Docker Benefits

| Feature | Without Docker | With Docker |
|---------|---------------|-------------|
| Setup Time | 30+ minutes | 2 minutes |
| MongoDB Setup | Manual install | Automatic |
| Node Version | Manual manage | Auto-configured |
| Team Onboarding | Complex | One command |
| Environment Issues | Common | Never |
| Port Conflicts | Possible | Isolated |

---

## 📱 Access from Mobile/Other Devices

Docker containers ko network pe access karne ke liye:

```bash
# 1. Apna local IP pata karo
ipconfig  # Windows
ifconfig  # Mac/Linux

# 2. Mobile/tablet se access karo
http://YOUR_IP:5173  # Frontend
http://YOUR_IP:5000  # Backend
```

> **Note**: Firewall allow karna pad sakta hai

---

## 🐛 Common Issues & Solutions

### Issue: Port already in use
```bash
# Solution: Port change karo docker-compose.yml mein
# Ya running service stop karo
```

### Issue: MongoDB connection failed
```bash
# Solution: Check .env file
# Docker mein: mongodb://mongodb:27017/school-management
# Local mein: mongodb://localhost:27017/school-management
```

### Issue: Changes not reflecting
```bash
# Solution: Rebuild containers
docker-compose down
docker-compose up --build
```

### Issue: Permission denied
```bash
# Solution: Docker Desktop running hai check karo
# Windows: Run as Administrator
```

---

## 📚 Urdu Guide - Docker Kaise Use Karein

### Pehli Baar Setup

1. **Docker Desktop Install Karo**
   - [Docker.com](https://docker.com) se download karo
   - Install karo aur start karo

2. **Project Clone Karo**
   ```bash
   git clone https://github.com/mudassirsaleem47/School-Management-System.git
   cd School-Management-System
   ```

3. **Start Karo**
   ```bash
   docker-compose up
   ```

4. **Browser Mein Kholo**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

### Rozana Development

1. **Morning - Start Karo**
   ```bash
   docker-compose up
   ```

2. **Code Likho**
   - VS Code mein files edit karo
   - Changes automatically reload honge

3. **Evening - Stop Karo**
   ```bash
   docker-compose down
   ```

### Naye Computer Pe

1. **Docker Install Karo**
2. **Git Clone Karo**
3. **Docker Compose Up Karo**
4. **Done! 🎉**

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Developer

**Mudassir Saleem**
- GitHub: [@mudassirsaleem47](https://github.com/mudassirsaleem47)

---

## 🆘 Support

Agar koi problem aaye toh:
1. README ki troubleshooting section dekho
2. GitHub Issues pe post karo
3. Docker logs check karo: `docker-compose logs`

---

**Happy Coding! 🚀**
