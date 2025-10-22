# backend/services/db.py
import os
from sqlalchemy import create_engine, MetaData, Table, Column, String, Integer, Text, DateTime
from sqlalchemy.sql import func
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
metadata = MetaData()

interactions = Table(
    "interactions", metadata,
    Column("id", String, primary_key=True),
    Column("user_id", String, nullable=True),
    Column("original_text", Text),
    Column("level", String),
    Column("simplified_text", Text),
    Column("analogy", Text),
    Column("questions_json", Text),
    Column("image_path", String),
    Column("rating", Integer, nullable=True),
    Column("feedback", Text, nullable=True),
    Column("created_at", DateTime, server_default=func.now())
)

metadata.create_all(engine)

def insert_interaction(conn, data: dict):
    conn.execute(interactions.insert().values(**data))

def get_interaction(conn, id: str):
    row = conn.execute(interactions.select().where(interactions.c.id == id)).fetchone()
    return row

def list_recent(conn, limit: int = 50):
    return conn.execute(interactions.select().order_by(interactions.c.created_at.desc()).limit(limit)).fetchall()
