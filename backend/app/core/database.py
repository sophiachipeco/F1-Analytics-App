#Database connection with supabase
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("No DATABASE_URL found in .env file")

#Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

#Start session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Optional: Quick test when running this file directly
if __name__ == "__main__":
    try:
        with engine.connect() as connection:
            print("Successfully connected to the Docker database!")
    except Exception as e:
        print(f"Connection failed: {e}")