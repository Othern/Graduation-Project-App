import requests
import json

# with open('Graduation-Project-App/config.json') as f:
#     config = json.load(f)


def get_elevation(lat, lng, api_key):
    url = f"https://maps.googleapis.com/maps/api/elevation/json?locations={lat},{lng}&key={api_key}"
    
    response = requests.get(url)
    
    if response.status_code == 200:
        result = response.json()
        if result['status'] == 'OK':
            elevation = result['results'][0]['elevation']
            return elevation
        else:
            return f"Error: {result['status']}"
    else:
        return f"HTTP Error: {response.status_code}"

# 使用示例
# api_key = config[ "GOOGLE_MAP_API"]
# latitude = 23.4443894  # 例如：玉山國家公園
# longitude = 121.03351  # 例如：玉山國家公園

# elevation = get_elevation(latitude, longitude, api_key)
# print(f"The elevation at ({latitude}, {longitude}) is approximately {elevation} meters.")