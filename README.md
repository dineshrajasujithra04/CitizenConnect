# 🏛️ CitizenConnect – Cloud-Based Citizen Service Platform

**CitizenConnect** is a cloud-deployed web application that enables citizens to register public service complaints, track their progress, and monitor complaint statistics through an interactive dashboard.

The platform provides a simple and transparent way to manage public service requests, helping make complaint tracking more accessible and organized.

## 🌐 Live Demo

* **Frontend:** https://citizenconnect-frontend-o0zb.onrender.com
* **Backend API:** https://citizenconnect-backend-k2p8.onrender.com
* **API Documentation:** https://citizenconnect-backend-k2p8.onrender.com/docs

## ✨ Features

* **Interactive Dashboard:** Displays total, pending, in-progress, and resolved complaints.
* **Complaint Registration:** Allows citizens to submit complaints with their name, service category, location, and description.
* **Complaint Tracking:** Displays submitted complaints with their details and current status.
* **Status Management:** Allows complaint statuses to be updated to Pending, In Progress, or Resolved.
* **Search Functionality:** Helps users find complaints using relevant information.
* **Status Filtering:** Filters complaints according to their current status.
* **Complaint Deletion:** Allows existing complaint records to be deleted.
* **REST API:** Uses FastAPI endpoints to communicate between the frontend and backend.
* **Cloud Deployment:** Frontend and backend are deployed separately using Render.

## 🛠️ Technologies Used

### Frontend

* React
* JavaScript
* Vite
* HTML
* CSS

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* SQLite

### Tools and Deployment

* Git
* GitHub
* Render
* VS Code

## 🏗️ System Architecture

The application follows a frontend–backend architecture.

```text
             Citizen / User
                   |
                   v
       React Frontend (Vite)
                   |
             HTTP Requests
                   |
                   v
          FastAPI REST API
                   |
                   v
             SQLAlchemy
                   |
                   v
             SQLite Database
```

The React frontend sends requests to the FastAPI backend. The backend processes requests, interacts with the database through SQLAlchemy, and returns responses to update the dashboard and complaint records.

## 📂 Project Structure

```text
Cloud-Based Citizen Service Platform/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── public/
│   ├── package.json
│   └── index.html
│
├── .gitignore
└── README.md
```

*Note: Additional files may be present in the project directories.*

## ⚙️ Installation and Setup

### Prerequisites

Install the following software before running the project locally:

* Python
* Node.js and npm
* Git
* Visual Studio Code

### 1. Clone the Repository

```bash
git clone https://github.com/dineshrajasujithra04/CitizenConnect.git
```

Navigate to the project directory:

```bash
cd CitizenConnect
```

### 2. Set Up the Backend

Open a terminal and run:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the environment on Windows:

```cmd
venv\Scripts\activate
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will run locally at:

http://127.0.0.1:8000

Open the API documentation:

http://127.0.0.1:8000/docs

### 3. Set Up the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local frontend URL displayed in the terminal, usually:

http://localhost:5173

## 🔗 API Endpoints

| Method | Endpoint                            | Description                               |
| ------ | ----------------------------------- | ----------------------------------------- |
| GET    | `/`                                 | Checks whether the backend API is running |
| POST   | `/complaints`                       | Registers a new complaint                 |
| GET    | `/complaints`                       | Retrieves all complaints                  |
| GET    | `/complaints/{complaint_id}`        | Retrieves a complaint by ID               |
| PUT    | `/complaints/{complaint_id}/status` | Updates a complaint's status              |
| DELETE | `/complaints/{complaint_id}`        | Deletes a complaint                       |
| GET    | `/dashboard`                        | Retrieves complaint statistics            |

Interactive API documentation is available at:

https://citizenconnect-backend-k2p8.onrender.com/docs

## 🔄 Application Workflow

1. The user opens the CitizenConnect website.
2. The dashboard retrieves complaint records and statistics from the backend.
3. The user enters the required information in the complaint registration form.
4. The frontend sends the complaint details to the FastAPI backend.
5. The backend validates the information and stores the complaint in the database.
6. The complaint appears in the complaint records section.
7. The complaint status can be updated as the request progresses.
8. The dashboard statistics reflect the current complaint statuses.
9. Users can search, filter, and delete complaint records.

## ☁️ Cloud Deployment

CitizenConnect is deployed using Render.

* The **frontend** is deployed as a Render Static Site.
* The **backend** is deployed as a Render Web Service.
* The frontend communicates with the backend through HTTPS API requests.
* Cross-Origin Resource Sharing (CORS) is configured to permit requests from the deployed frontend.

### Deployment URLs

| Component         | URL                                                   |
| ----------------- | ----------------------------------------------------- |
| Frontend          | https://citizenconnect-frontend-o0zb.onrender.com     |
| Backend           | https://citizenconnect-backend-k2p8.onrender.com      |
| API Documentation | https://citizenconnect-backend-k2p8.onrender.com/docs |

**Database note:** The current backend uses SQLite. For reliable persistent storage in a cloud environment, configure a persistent storage solution or migrate to a managed PostgreSQL database.

## 🎯 Project Objectives

* Simplify public service complaint registration.
* Provide an organized system for tracking complaints.
* Improve visibility into complaint statuses.
* Display complaint statistics through an interactive dashboard.
* Demonstrate full-stack web development and cloud deployment.
* Enable communication between a React frontend and a Python REST API.

## 🚀 Future Enhancements

* Citizen authentication and secure user accounts.
* Administrator and citizen role management.
* Email or SMS notifications for complaint updates.
* Complaint assignment to responsible departments.
* File and image attachments for complaints.
* Advanced analytics and reporting.
* Integration with a managed cloud database.
* Complaint history and audit logs.

## 👩‍💻 Author

**Sujithra Dineshraja**

GitHub: https://github.com/dineshrajasujithra04

## 📄 License

This project was developed for educational and demonstration purposes.
