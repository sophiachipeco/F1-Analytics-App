#handles all functions that use fastf1 -> fetch and process data
# may split into multiple files later

import fastf1

#test function -> get race results from desired session
def getRaceResults(year: int, raceName: str) :
    session = fastf1.get_session(year, raceName, "R")
    session.load()
    results = session.results

    #clean the format
    return results[["LastName", "Position", "GridPosition", "Time"]]

