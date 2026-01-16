import fastf1
import uvicorn
import pandas
from fastapi import FastAPI, HTTPException

from app.controllers import auth

app = FastAPI()
#NOTE: FastF1 uses Pandas and Numpy -> They have their own number types
#FastAPI expects standard python types (int, float etc) so that it can turn them into JSON format

#Include routers
app.include_router(auth.router)

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

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)