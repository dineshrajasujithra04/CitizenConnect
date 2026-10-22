from sqlalchemy import Column, Integer, String, Text
from database import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)

    citizen_name = Column(
        String(100),
        nullable=False
    )

    service_type = Column(
        String(100),
        nullable=False
    )

    location = Column(
        String(200),
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    status = Column(
        String(20),
        default="Pending",
        nullable=False
    )