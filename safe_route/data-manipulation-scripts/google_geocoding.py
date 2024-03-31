import os
import pandas as pd
import requests

from dotenv import  load_dotenv
load_dotenv()
# Your Google API Key
google_api_key = os.getenv('GOOGLE_GEOCODING_API_KEY')

file_path = '../public/data/UMPD_Daily_Crime_filtered_sorted.csv'
df = pd.read_csv(file_path)

# Function to geocode address using Google Maps Geocoding API
def geocode_address_google(row):
    params = {
        'address': f"{row['Incident Location']}, {row['City']}, {row['State']}, {row['Country']}",
        'key': google_api_key
    }
    response = requests.get('https://maps.googleapis.com/maps/api/geocode/json', params=params)
    print("API response:", response.text)  # Add this line to print the response
    if response.status_code == 200:
        json_response = response.json()
        results = json_response.get('results')
        if results:
            location = results[0].get('geometry').get('location')
            return pd.Series([location['lat'], location['lng']])
        else:
            print("No results in the response.")
    else:
        print(f"Geocoding API error: {response.status_code}, {response.content}")
    return pd.Series([None, None])


# Apply the geocode function to each row
# This creates two new columns 'Latitude' and 'Longitude' in the DataFrame
df[['Latitude', 'Longitude']] = df.apply(geocode_address_google, axis=1)

# Save the geocoded data to a new CSV file
output_file_path = '../public/data/UMPD_Daily_Crime_with_Coordinates_Google.csv'
df.to_csv(output_file_path, index=False)

print("Geocoding complete. Output saved to:", output_file_path)
