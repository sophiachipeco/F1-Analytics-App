import fastf1
import uvicorn
import pandas
from fastapi import FastAPI, HTTPException
from app.core.database import engine, Base
from app.models.sqlModels import User, UserSettings
from app.controllers import auth
from app.controllers import admin

#Create missing tables in postgres
Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#NOTE: FastF1 uses Pandas and Numpy -> They have their own number types
#FastAPI expects standard python types (int, float etc) so that it can turn them into JSON format

#Include routers
app.include_router(auth.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/session/{year}/{location}/{type}")
def get_session(year: int, location: str, type: str):
    #Session types: FP1, FP2, FP3, Q, R
    session = fastf1.get_session(year, location, type)
    event_info = session.event.to_dict()
    
    return {
        "EventName": str(event_info.get("EventName")),
        "OfficialEventName": str(event_info.get("OfficialEventName")),
        "EventDate": str(event_info.get("EventDate"))
    }