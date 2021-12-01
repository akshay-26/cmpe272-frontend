from flask import Flask, request, jsonify, make_response
import tensorflow as tf
import numpy as np
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
from werkzeug.wrappers import response

app = Flask(__name__)
CORS(app, resources={r"/upload": {"origins": "*"}})
CORS(app, resources={r"/": {"origins": "*"}})

# app.config['CORS_HEADERS'] = 'Content-Type'
# cors = CORS(app, resources={r"/": {"origins": "http://localhost:port"}})

model = tf.keras.models.load_model("cmpe_272_a2_v2.h5")
class_dict_init = {'CNV': 0, 'DME': 1, 'DRUSEN': 2, 'NORMAL': 3}
class_dict = dict([(v,k) for k,v in class_dict_init.items()])


UPLOAD_FOLDER = '.\\uploads'


def preprocess_image(path):
    IMG_HEIGHT, IMG_WIDTH = 160, 160
    img = tf.io.read_file(path)
    img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.convert_image_dtype(img, tf.float32)
    img = tf.expand_dims(img, 0)
    img = tf.image.resize(img, [IMG_HEIGHT, IMG_WIDTH])
    print(img.shape)
    return img

def predict(img):
    arr = model.predict(img)
    predicted_class = class_dict[np.argmax(arr)]
    print("Array---",arr, predicted_class)
    return predicted_class


@app.route('/upload', methods = ['POST'])
def upload_file():
    # request.headers.add("Access-Control-Allow-Origin", "*")
    # response = make_response()
    # response.headers.add("Access-Control-Allow-Origin", "*")
    # response.headers.add('Access-Control-Allow-Headers', "*")
    # response.headers.add('Access-Control-Allow-Methods', "*")
    # print("\n\n ----------- Inside upload -----------------", type(request))
    # print(f"\n\n ----------- Inside Files -----------------{request.files}")

    target=os.path.join(UPLOAD_FOLDER,'test_imgs')
    if not os.path.isdir(target):
        os.mkdir(target)
    print("welcome to upload`")

    try:
        file = request.files['file']
        filename = secure_filename(file.filename)
        destination="/".join([target, filename])
        file.save(destination)
        print("\n\n\n Dest->",destination)

        img = preprocess_image(destination)
        predicted_class = predict(img)
    
        print(file)
        return predicted_class
    except Exception as e:
        print("error ", e)
        return e
    

@app.route("/")
# @cross_origin(origin='localhost:3000',headers=['Content-Type','multipart/form-data'])
def hello():
    # # request.headers.add("Access-Control-Allow-Origin", "*")
    # img = preprocess_image("NORMAL-img.jpeg")
    # predicted_class = predict(img)
    return "Pathology-Detection"


if __name__ == "__main__":
    # app.run(debug=True)
    # cors.init_app(app)
    app.run(debug=True,host="0.0.0.0", port=5000)


# CORS(app, expose_headers='Authorization')
