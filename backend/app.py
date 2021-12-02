from flask import Flask, request, jsonify, make_response
import tensorflow as tf
import numpy as np
import os
from tensorflow.python.ops.gen_io_ops import read_file
from werkzeug.utils import secure_filename
from flask_cors import CORS
# from werkzeug.wrappers import response


from PIL import Image
import requests
from io import BytesIO

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}})
CORS(app, resources={r"/": {"origins": "*"}})

# app.config['CORS_HEADERS'] = 'Content-Type'
# cors = CORS(app, resources={r"/": {"origins": "http://localhost:port"}})
IMG_HEIGHT, IMG_WIDTH = 160, 160
model = tf.keras.models.load_model("cmpe_272_a3_v1.h5")
class_dict_init = {'CNV': 0, 'DME': 1, 'DRUSEN': 2, 'NORMAL': 3}
class_dict = dict([(v,k) for k,v in class_dict_init.items()])


UPLOAD_FOLDER = './uploads'


def preprocess_image(path, is_png):
    img = tf.io.read_file(path)
    if is_png:
        img = tf.image.decode_png(img, channels=3)
    else:
        img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.convert_image_dtype(img, tf.float32)
    img = tf.expand_dims(img, 0)
    img = tf.image.resize(img, [IMG_HEIGHT, IMG_WIDTH])
    print(img.shape)
    return img

def predict(img):
    arr = model.predict(img)
    conf = round(np.max(arr)*100, 2)
    predicted_class = class_dict[np.argmax(arr)]
    print("Array---",predicted_class, conf)
    return predicted_class, conf


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
    


@app.route("/predict",  methods = ['POST'])
def get_prediction():
    # url="https://ubereats-harsha.s3.us-west-1.amazonaws.com/pathalogy/NORMAL-img.jpeg"
    # response = requests.get(url)
    is_png = False
    IMG_FILE_PATH = "temp.jpeg"

    data = request.get_json(force=True)
    print("json data", data)

    url=data.get("url")
    print("request ->", url)
    response = requests.get(url)
    img = Image.open(BytesIO(response.content))
    print("\n\nType -> ", type(img), str(type(img)))
    if(str(type(img)) == "<class 'PIL.PngImagePlugin.PngImageFile'>"):
        IMG_FILE_PATH = "temp.png"
        is_png=True

    img.save(IMG_FILE_PATH)
    img = preprocess_image(IMG_FILE_PATH, is_png)
    predicted_class, conf = predict(img)
    
    output = {
        "success": True,
        "data": {
            "class": predicted_class,
            "confidence": conf
        }
    }

    return output

@app.route("/")
# @cross_origin(origin='localhost:3000',headers=['Content-Type','multipart/form-data'])
def hello():
    # # request.headers.add("Access-Control-Allow-Origin", "*")
    img = preprocess_image("NORMAL-img.jpeg")
    print("helllo func - ", img.shape)
    predicted_class = predict(img)
    return predicted_class


if __name__ == "__main__":
    # app.run(debug=True)
    # cors.init_app(app)
    app.run(debug=True,host="0.0.0.0", port=5000)


# CORS(app, expose_headers='Authorization')
