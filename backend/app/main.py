from fastapi import FastAPI
from .routes import races, auth

app = FastAPI()

#include routers
app.include_router(races.router)
#app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"Backend": "Running"}

if __name__ == "__main__":
    from app.services.fastf1Logic import getRaceResults

    print("---Logic test---")

    while True:
        try:
            yearInput = input("Enter year: ")
            if yearInput.lower() == "exit":
                break

            raceInput = input("Enter race name: ")
            if raceInput.lower() == "exit":
                break

            print(f"\nFetching results for {yearInput} {raceInput}...")
            results = getRaceResults(int(yearInput), raceInput)

            print("\n ---Results---")
            print(results)
            print("----------\n")
            
        except ValueError:
            print("Invalid year")
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"An error occurred: {e}\n")
    print("\nBye")