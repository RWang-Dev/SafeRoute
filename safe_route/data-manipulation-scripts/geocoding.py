import pandas as pd
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter


file_path = 'UMPD_Daily_Crime_filtered_sorted.csv'

df = pd.read_csv(file_path)

# Initialize the geocoder
geolocator = Nominatim(user_agent="UMN_Crime_Data_Geocoder_Class_Project/1.0 (larin006@umn.edu)",  timeout=10)

# To avoid hitting the service rate limit, we need to use RateLimiter to add a delay between geocoding calls
geocode = RateLimiter(geolocator.geocode, min_delay_seconds=1, error_wait_seconds=10, max_retries=2, swallow_exceptions=True)

def geocode_address(row):
    try:
        location = geocode(f"{row['Incident Location']}, {row['City']}, {row['State']}, {row['Country']}")
        if location:
            return pd.Series([location.latitude, location.longitude])
    except Exception as e:
        print(f"Error geocoding {row['Incident Location']}: {e}")
    return pd.Series([None, None])

# Apply the geocode function to each row
# This creates two new columns 'Latitude' and 'Longitude' in the DataFrame
df[['Latitude', 'Longitude']] = df.apply(geocode_address, axis=1)

output_file_path = 'UMPD_Daily_Crime_with_Coordinates.csv'
df.to_csv(output_file_path, index=False)

print("Geocoding complete. Output saved to:", output_file_path)
