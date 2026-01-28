#For backend user testing since supabase needs authentication token
#The backend basically doesnt know who you are between refreshes

import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv("../.env")

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase = create_client(url, key)

#Login Details
EMAIL = "emmyfong@gmail.com"
PASSWORD = "password"

try:
    #sign in
    response = supabase.auth.sign_in_with_password({"email": EMAIL, "password": PASSWORD})
    
    print("\n--- YOUR ACCESS TOKEN ---")
    print(response.session.access_token)
    print("-------------------------\n")
    
except Exception as e:
    print(f"Error: {e}")