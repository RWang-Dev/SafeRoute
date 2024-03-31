import pandas as pd

csv_file_path = '../public/data/Google_UMPD_Daily_Crime_Aggregated_with_Location.csv'
json_file_path = '../public/Google_UMPD_Daily_Crime_Aggregated_with_Location.json'

df = pd.read_csv(csv_file_path)

df.to_json(json_file_path, orient='records', indent=2)

print(f"JSON file saved to {json_file_path}")

