# DocuStack


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![Node Version](https://img.shields.io/badge/Node-20.x-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18.x-blueviolet.svg)](https://reactjs.org/)
[![Express Version](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/Frontend-React.js-orange.svg)](https://reactjs.org/)
[![Backend-Node.js](https://img.shields.io/badge/Backend-Node.js-yellowgreen.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![VS Code](https://img.shields.io/badge/IDE-VS%20Code-blue.svg)](https://code.visualstudio.com/)


A hybrid **MERN + Python microservice** application that allows users to easily convert between different file formats:

- **Word → PDF**
- **PDF → Word**
- **Image(s) → PDF**
- **PDF → Images**

---

## 🏗️ Tech Stack

| Task                         | Technology                                      |
|-------------------------------|----------------------------------------------- |
| Frontend (UI)                 | React                                          |
| Backend API + File Upload     | Node.js + Express                              |
| Word ↔ PDF Conversion         | Python (`python-docx`, `pikepdf`)              |
| Image → PDF Conversion        | Python (`img2pdf`, `pdf2image`, Poppler)       |

---

## ⚡ Features

- Upload files via **drag & drop** or **file picker**
- Supports **multiple image uploads**
- Handles **Word, PDF, and image conversions**
- REST API backend powered by **Python microservices**
- Instant file downloads after conversion

---

## 📂 Project Structure


```bash
DocuStack/
│
├─ client/ # React frontend
│ ├─ public/
│ └─ src/
│ ├─ components/
│ ├─ pages/
│ └─ App.js
│
├─ server/ # Node/Express API for file upload & management
│ ├─ routes/
│ ├─ controllers/
│ └─ server.js
│
├─ python/ # Python conversion microservice
│ ├─ app.py
│ ├─ requirements.txt
│ └─ utils/
``


---

## 🔌 API Endpoints

### Image → PDF (etc) --> If you want to know more about microservice go through the app.py files 

---
<img width="1145" height="637" alt="image" src="https://github.com/user-attachments/assets/d77673fe-efac-4fec-9454-a873644a9333" />


---

## ⚙️ Backend Setup (Python microservice)

```bash
cd python
python -m venv venv
# Activate virtual environment
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
python -m pip install -r requirements.txt

# Run Python server
uvicorn app:app --reload --port 8000


⚙️ Node Backend Setup
cd ../server
npm install
npm start

⚙️ Frontend Setup (React)
cd ../client
npm install
npm start

`` 
🚀 Usage

Run Python microservice backend

Run Node API backend

Run React frontend

Upload files → download converted files instantly
``


``
**Note:** No database is used to store your documents, so your files are not saved permanently.
``



