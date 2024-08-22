import torch
import pickle
from kmeans_pytorch import kmeans_predict
from utils import read, process, normalize, haversine

def predict(school):
    training_results = {}
    with open('kmeans_model.pkl', 'rb') as file:
        training_results = pickle.load(file)

    means = training_results['means']
    std_dev = training_results['std_dev']
    centers = training_results['centers']
    labels = training_results['labels']

    schools = [school, school]
    predict_array = process(schools)
    predict_array = normalize(
        predict_array, 
        means, 
        std_dev, 
        'means_filling'
    )

    predict_tensor = torch.tensor(predict_array)

    cluster_ids_y = kmeans_predict(predict_tensor, centers, 'euclidean')

    school_list = read('./wa_secondary_schools.csv')
    recommend_schools = []
    for i in range(labels.shape[0]):
        if cluster_ids_y[0] == labels[i]:
            school_list[i]['distance'] = haversine(school['lat'], school['lon'], school_list[i]['lat'], school_list[i]['lon'])
            recommend_schools.append(school_list[i])
    return recommend_schools