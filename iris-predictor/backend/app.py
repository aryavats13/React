from flask import Flask, request, jsonify
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
model = pickle.load(open("model.pkl", "rb"))
target_names = ['setosa', 'versicolor', 'virginica']
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json  
    
    try:
        features = [[
            float(data['sepal_length']),
            float(data['sepal_width']),
            float(data['petal_length']),
            float(data['petal_width'])
        ]]
    except (KeyError, ValueError):
        return jsonify({"error": "Invalid input"}), 400

    prediction = model.predict(features)[0]
    return jsonify({"prediction": target_names[prediction]})

if __name__ == "__main__":
    app.run(port=5000, debug=True)