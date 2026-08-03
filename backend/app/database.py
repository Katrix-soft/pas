import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://postgres:postgres@localhost:5432/pas"
)

# SQLAlchemy requiere el driver 'postgresql+asyncpg://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)

# Elimina sslmode si está presente en la URL interna de Docker
if "?sslmode=disable" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("?sslmode=disable", "")

sql_echo = os.getenv("SQL_ECHO", "false").lower() == "true"

engine = create_async_engine(
    DATABASE_URL, 
    echo=sql_echo,
    pool_size=5,
    max_overflow=5,
    pool_timeout=30,
    pool_recycle=1800,
    pool_pre_ping=True
)

AsyncSessionLocal = sessionmaker(
    bind=engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
