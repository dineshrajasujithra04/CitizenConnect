from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Complaint


# Create the database tables when the application starts.
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


# Create the FastAPI application.
app = FastAPI(
    title="Cloud-Based Citizen Service Platform",
    description="CitizenConnect - Register and track public service complaints.",
    version="1.0.0",
    lifespan=lifespan
)


# Allow the local React frontend to communicate with the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Request model for creating a complaint.
class ComplaintCreate(BaseModel):
    citizen_name: str = Field(min_length=1, max_length=100)
    service_type: str = Field(min_length=1, max_length=100)
    location: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=2000)


# Request model for changing complaint status.
class StatusUpdate(BaseModel):
    status: str


# Response model returned by the API.
class ComplaintResponse(BaseModel):
    id: int
    citizen_name: str
    service_type: str
    location: str
    description: str
    status: str

    model_config = ConfigDict(from_attributes=True)


# Home route.
@app.get("/")
def home():
    return {
        "message": "Cloud-Based Citizen Service Platform API is running!",
        "project": "CitizenConnect",
        "docs": "/docs"
    }


# Create a new complaint.
@app.post(
    "/complaints",
    response_model=ComplaintResponse,
    status_code=201
)
def create_complaint(
    complaint_data: ComplaintCreate,
    db: Session = Depends(get_db)
):
    values = {
        "citizen_name": complaint_data.citizen_name.strip(),
        "service_type": complaint_data.service_type.strip(),
        "location": complaint_data.location.strip(),
        "description": complaint_data.description.strip()
    }

    if not all(values.values()):
        raise HTTPException(
            status_code=422,
            detail="All fields must contain valid text."
        )

    complaint = Complaint(
        **values,
        status="Pending"
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return complaint


# Retrieve all complaints.
@app.get(
    "/complaints",
    response_model=list[ComplaintResponse]
)
def get_complaints(db: Session = Depends(get_db)):
    return (
        db.query(Complaint)
        .order_by(Complaint.id.desc())
        .all()
    )


# Retrieve one complaint using its ID.
@app.get(
    "/complaints/{complaint_id}",
    response_model=ComplaintResponse
)
def get_complaint(
    complaint_id: int,
    db: Session = Depends(get_db)
):
    complaint = (
        db.query(Complaint)
        .filter(Complaint.id == complaint_id)
        .first()
    )

    if complaint is None:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    return complaint


# Update the status of a complaint.
@app.put(
    "/complaints/{complaint_id}/status",
    response_model=ComplaintResponse
)
def update_status(
    complaint_id: int,
    status_data: StatusUpdate,
    db: Session = Depends(get_db)
):
    complaint = (
        db.query(Complaint)
        .filter(Complaint.id == complaint_id)
        .first()
    )

    if complaint is None:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    allowed_statuses = [
        "Pending",
        "In Progress",
        "Resolved"
    ]

    if status_data.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid complaint status."
        )

    complaint.status = status_data.status

    db.commit()
    db.refresh(complaint)

    return complaint


# Delete a complaint.
@app.delete("/complaints/{complaint_id}")
def delete_complaint(
    complaint_id: int,
    db: Session = Depends(get_db)
):
    complaint = (
        db.query(Complaint)
        .filter(Complaint.id == complaint_id)
        .first()
    )

    if complaint is None:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    db.delete(complaint)
    db.commit()

    return {
        "message": "Complaint deleted successfully"
    }


# Return dashboard statistics.
@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    total = db.query(Complaint).count()

    pending = (
        db.query(Complaint)
        .filter(Complaint.status == "Pending")
        .count()
    )

    in_progress = (
        db.query(Complaint)
        .filter(Complaint.status == "In Progress")
        .count()
    )

    resolved = (
        db.query(Complaint)
        .filter(Complaint.status == "Resolved")
        .count()
    )

    return {
        "total_complaints": total,
        "pending_complaints": pending,
        "in_progress_complaints": in_progress,
        "resolved_complaints": resolved
    }