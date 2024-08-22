from flask import Flask, request, jsonify
from utils import to_int, to_float
from kmeans import predict

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response

@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    order = request.args.get('order')
    school = {
        'lat': to_float(request.args.get('lat')),
        'lon': to_float(request.args.get('lon')),
        'num_student': to_int(request.args.get('num_student')),
        'atar': to_int(request.args.get('atar')),
        'icsea': to_int(request.args.get('icsea')),
    }
    sorted_schools = predict(school)
    if order == "distance":
        sorted_schools.sort(key=lambda x: x["distance"])
    elif order == "atar":
        sorted_schools.sort(key=lambda x: x["atar"], reverse=True)
    elif order == "icsea":
        sorted_schools.sort(key=lambda x: x["icsea"], reverse=True)
    
    return sorted_schools

if __name__ == '__main__':
    app.run(debug=True)