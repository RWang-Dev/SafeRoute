import hdbscan
import json
import numpy as np

with open('../public/Google_UMPD_Daily_Crime_Aggregated_with_Location.json', 'r') as jsonfile:
    data = json.load(jsonfile)

coords = np.array([[d['Latitude'], d['Longitude']] for d in data])

coords_radians = np.radians(coords)

clusterer = hdbscan.HDBSCAN(min_cluster_size=2,min_samples=2, metric='haversine', cluster_selection_method='leaf')
cluster_labels = clusterer.fit_predict(coords_radians)

clusters = {}
for idx, label in enumerate(cluster_labels):
    if label == -1:
        continue
    if label not in clusters:
        clusters[label] = {
            'coords': [],
            'Total Severity Score': 0,
            'Crime Count': 0
        }
    clusters[label]['coords'].append(coords[idx])
    clusters[label]['Total Severity Score'] += data[idx]['Total Severity Score']
    clusters[label]['Crime Count'] += data[idx]['Crime Count']

clustered_data = []
for label, cluster in clusters.items():
    centroid = np.mean(cluster['coords'], axis=0)
    clustered_data.append({
        'Latitude': centroid[0],
        'Longitude': centroid[1],
        'Total Severity Score': cluster['Total Severity Score'],
        'Crime Count': cluster['Crime Count']
    })

# clustered_data now contains the data for the map markers
    
with open('../public/clustered_data.json', 'w') as outfile:
    json.dump(clustered_data, outfile, indent=4)
