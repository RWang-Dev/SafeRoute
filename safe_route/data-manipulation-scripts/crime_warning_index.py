import pandas as pd


file_path = 'UMPD_Daily_Crime_with_Coordinates.csv'
df = pd.read_csv(file_path)

crime_severity = {
    'Assault': 8,
    'Theft': 5,
    'Hit/Run': 7,
    'Assault w/ Dangerous Weapon': 10,
    'Bike Theft': 3,
    'Criminal Sexual Conduct - Rape': 15,
    'Stalking': 4,
    'Stalking x2': 4,
    'Rape': 15,
    'Fondling': 6,
    'Aggravated Assault': 10,
    'Discharge Weapon': 12,
    'Possession of Stolen Firearm / Unlawful': 8,
    'Possession of Firearm / Narcotics Violation /': 9,
    'Theft from Person': 5,
    'Assault / Narcotics Violation': 8,
    'Overdose': 6,
    'Hit and Run': 7,
    'Hit and Run with Injury': 11,
    'Intimidation: Race Bias': 6,
    'Rape; Stalking': 15,
    'Weapons Law Violation': 8,
    'Indecent Conduct': 5,
    'Criminal Sexual Conduct-Molest': 15,
    'Intimidation: Religion Bias': 6,
    'Assault w/dangerous weapon': 10,
    'Sexual Assault': 8,
    'Robbery of Person': 10,
    'Burglary': 8
}


df['Severity Score'] = df['Nature of Offense'].map(crime_severity)



aggregated_data = df.groupby(['Latitude', 'Longitude', 'Incident Location']).agg({
    'Severity Score': 'sum',  # This sums the severity scores for each location
    'Nature of Offense': 'size'  # This counts the number of crimes at each location
}).rename(columns={'Severity Score': 'Total Severity Score', 'Nature of Offense': 'Crime Count'}).reset_index()


output_file_path = 'UMPD_Daily_Crime_Aggregated_with_Location.csv'
aggregated_data.to_csv(output_file_path, index=False)

print(f"Aggregated dataset with location saved to {output_file_path}.")

