import csv
import math
import numpy as np

# Convert a string to an integer. If the conversion fails, return -1.
def to_int(value):
    try:
        return int(value)
    except ValueError:
        return -1

# Convert a string to a float. If the conversion fails, return -1.
def to_float(value):
    try:
        return float(value)
    except ValueError:
        return -1

# Read data from a CSV file and convert it to a list of dictionaries representing schools.
# Each dictionary contains details about a school: name, latitude, longitude, number of students, ATAR, and ICSEA values.
def read(path):
    school_list = [] 
    with open(path, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            school = {}
            school['name'] = row['School Name']
            school['street'] = row['Street']
            school['suburb'] = row['Suburb']
            school['state'] = row['State']
            school['postcode'] = row['Postcode']
            school['phone'] = row['Phone']
            school['lat'] = to_float(row['Latitude'])
            school['lon'] = to_float(row['Longitude'])
            school['num_student'] = to_int(row['Total Students'])
            school['atar'] = to_float(row['Median ATAR'])
            school['icsea'] = to_int(row['ICSEA'])
            school_list.append(school)
    return school_list 

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0

    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        
    distance = R * c
    return distance

# Process the list of school data by transforming each school's geographic data and other attributes.
# Convert lat/lon from degrees to radians and calculate additional trigonometric features.
def process(school_list):
    school_ndarray = np.array(school_list)
    processed_list = []
    
    # Iterate over each school's data.
    for i in range(len(school_ndarray)):
        school = school_ndarray[i]
        
        # Convert latitude and longitude from degrees to radians.
        lat_rad = np.radians(school['lat'])
        lon_rad = np.radians(school['lon'])
        
        # Calculate the sine and cosine of the latitude and longitude.
        lat_sin = np.sin(lat_rad)
        lat_cos = np.cos(lat_rad)
        lon_sin = np.sin(lon_rad)
        lon_cos = np.cos(lon_rad)
        
        # Extract other school attributes.
        total_students = school['num_student']
        icsea = school['icsea']
        atar_percent = school['atar']
        
        # Create a list of processed data containing trigonometric values and school attributes.
        data = [lat_sin, lat_cos, lon_sin, lon_cos, total_students, icsea, atar_percent]
        processed_list.append(data)  # Append the processed data to the list.
    
    # Convert the processed list into a NumPy array for further operations.
    processed_array = np.array(processed_list)
    return processed_array

# Normalize the processed array by applying a transformation based on the provided means and standard deviations.
# Handle missing values based on the specified strategy (either filling them with means or removing rows).
def normalize(processed_array, means, std_dev, miss_value_handling):
    # Define weights for each feature to adjust their contribution in the normalization.
    weights = np.array([1, 1, 1, 1, 2, 4, 4])  # Adjusts the importance of specific features.
    
    # Use z-score normailzation
    processed_array = (processed_array - means) / std_dev
    # Calculate weighted array
    processed_array = weights * processed_array
    
    # Handle missing values (-1) based on the specified strategy.
    if miss_value_handling == "means_filling":
        # Replace missing values (-1) with the corresponding mean value.
        processed_array = np.where(processed_array == -1, means, processed_array)
    else:
        # Identify rows that contain missing values and remove them.
        rows_to_remove = np.any(processed_array == -1, axis=1)
        processed_array = processed_array[~rows_to_remove]
    
    return processed_array