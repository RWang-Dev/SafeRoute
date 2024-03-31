import pandas as pd

file_path = 'UMPD_Daily_Crime.csv'

def clean_column_names(df):
    # We only care about the type of crime and the location of the incident, not any of these other columns
    columns_to_drop = ['Case Number', 'Date/Time Occurred', 'Date Reported', 'Disposition']
    # Drop specified columns and return the modified DataFrame
    return df.drop(columns=columns_to_drop)

def relevant_crime(df):
    unique_crimes = df['Nature of Offense'].unique()
    print("Unique Crimes:", unique_crimes)
    
    crimes_to_keep = ['Assault', 'Theft', 'Hit/Run', 'Assault w/ Dangerous Weapon', 'Bike Theft', 'Criminal Sexual Conduct - Rape', 'Stalking', 'Stalking x2', 'Rape', 'Fondling', 'Aggravated Assault', 'Discharge Weapon', 'Possession of Stolen Firearm / Unlawful', 'Possession of Firearm / Narcotics Violation /', 'Theft from Person', 'Assault / Narcotics Violation', 'Overdose', 'Hit and Run', 'Hit and Run with Injury', 'Intimidation: Race Bias', 'Rape; Stalking', 'Weapons Law Violation', 'Indecent Conduct', 'Criminal Sexual Conduct-Molest', 'Intimidation: Religion Bias', 'Assault w/dangerous weapon', 'Sexual Assault', 'Robbery of Person', 'Burglary']
    # Filter the DataFrame for the relevant crimes and return it
    return df[df['Nature of Offense'].isin(crimes_to_keep)]

def sort_incident_locations(df):
    def address_sort_key(address):
        address_str = str(address).strip()  # Convert to string and strip whitespace
        sort_group = 0 if address_str[0].isdigit() else 1
        return (sort_group, address_str)

    # Apply the sorting function to the address column and sort; this makes it easier to see patterns in the data; 
    #like a lot of crimes happening in the same location
    sorted_df = df.sort_values(by='Incident Location', key=lambda x: x.map(address_sort_key))
    return sorted_df

def add_location_details(df):
    # Add 'City', 'State', and 'Country' columns with constant values; I did not have these in the original data set
    # but they are necessary for geocoding
    df['City'] = 'Minneapolis'
    df['State'] = 'Minnesota'
    df['Country'] = 'United States of America'
    return df

if __name__ == '__main__':
    df = pd.read_csv(file_path, on_bad_lines='skip')
    df = add_location_details(df)
    df_cleaned = clean_column_names(df)
    df_filtered = relevant_crime(df_cleaned)
    df_sorted = sort_incident_locations(df_filtered)
    df_sorted.to_csv('UMPD_Daily_Crime_filtered_sorted.csv', index=False)
