import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Float, ForeignKey, Integer, JSON, Text
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="pas") # "admin" or "pas"
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    profile = relationship("PasProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    clients = relationship("Client", back_populates="pas", cascade="all, delete-orphan")
    policies = relationship("Policy", back_populates="pas", cascade="all, delete-orphan")
    quotations = relationship("Quotation", back_populates="pas", cascade="all, delete-orphan")
    tickets = relationship("Ticket", back_populates="pas", cascade="all, delete-orphan")


class PasProfile(Base):
    __tablename__ = "pas_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    matricula = Column(String(100), nullable=True)
    broker_name = Column(String(255), default="JC Organizadores", nullable=False)
    active_clients_count = Column(Integer, default=0, nullable=False)
    active_policies_count = Column(Integer, default=0, nullable=False)
    monthly_commission_ars = Column(Float, default=0.0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="profile")


class Client(Base):
    __tablename__ = "clients"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    dni_cuit = Column(String(50), nullable=True, index=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    address = Column(String(255), nullable=True)
    status = Column(String(50), default="activo", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    pas = relationship("User", back_populates="clients")
    policies = relationship("Policy", back_populates="client", cascade="all, delete-orphan")


class Policy(Base):
    __tablename__ = "policies"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    client_id = Column(String(36), ForeignKey("clients.id", ondelete="SET NULL"), nullable=True, index=True)
    company = Column(String(100), nullable=False) # Mercantil Andina, Sancor Seguros, etc.
    policy_number = Column(String(100), nullable=False, index=True)
    branch = Column(String(100), default="AUTOMOTORES", nullable=False)
    vehicle_details = Column(JSON, nullable=True)
    premium_amount = Column(Float, default=0.0, nullable=False)
    status = Column(String(50), default="vigente", nullable=False)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    pas = relationship("User", back_populates="policies")
    client = relationship("Client", back_populates="policies")


class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    company = Column(String(100), nullable=False)
    vehicle_data = Column(JSON, nullable=True)
    quote_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    pas = relationship("User", back_populates="quotations")


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="pendiente", nullable=False)
    priority = Column(String(50), default="media", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    pas = relationship("User", back_populates="tickets")
