import numpy as np

def to_int(value):
    try:
        return int(value)
    except ValueError:
        return -1

def to_float(value):
    try:
        return float(value)
    except ValueError:
        return -1

def process(school_list):
    school_ndarray = np.array(school_list)
    processed_list = []
    for i in range(len(school_ndarray)):
        school = school_ndarray[i]
        lat_rad = np.radians(school['lat'])
        lon_rad = np.radians(school['lon'])
        lat_sin = np.sin(lat_rad)
        lat_cos = np.cos(lat_rad)
        lon_sin = np.sin(lon_rad)
        lon_cos = np.cos(lon_rad)
        total_students = school['num_student']
        icsea = school['icsea']
        atar_percent = school['atar']
        data = [lat_sin, lat_cos, lon_sin, lon_cos, total_students, icsea, atar_percent]
        processed_list.append(data)
    processed_array = np.array(processed_list)
    return processed_array

def normalize(processed_array, means, std_dev, miss_value_handling):
    weights = np.array([1, 1, 1, 1, 2, 4, 4])
    processed_array = (processed_array - means) / std_dev
    print(means)
    print(std_dev)
    processed_array = weights * processed_array
    if miss_value_handling == "means_filling":
        processed_array = np.where(processed_array == -1, means, processed_array)
    else:
        rows_to_remove = np.any(processed_array == -1, axis=1)
        processed_array = processed_array[~rows_to_remove]
        # school_ndarray = school_ndarray[~rows_to_remove]
    return processed_array