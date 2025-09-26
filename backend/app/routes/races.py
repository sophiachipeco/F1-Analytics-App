#handles all routes related to race data (races laps drivers)

from fastapi import APIRouter
from ..services import fastf1Logic

router = APIRouter(
    prefix="/races", #routes in file will start with /races
    tags=["Races"]
)

@router.get("/{year/{raceName}/results")
def getRaceResultsRoute(year: int, raceName: str):
    results = fastf1Logic.getRaceResults(year, raceName)
    return{"Results": results}
