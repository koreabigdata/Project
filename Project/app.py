from flask import Flask,render_template, request
import numpy as np
import tensorflow as tf
app = Flask(__name__)
model = None

mt_example = ['아차산','관악산','남산']


def loading_model():
    global model
    global graph
    graph = tf.compat.v1.get_default_graph()
    model = tf.keras.models.load_model('model.h5')

loading_model()

@app.route('/')
@app.route('/<task>')
def hello_world(task=''):
    return render_template('index.html', task=task)


@app.route('/analysis')
def analysis_page():
    return render_template('analysis.html')


@app.route('/predict')
def predict():
    loading_model()

    with graph.as_default():
        x = np.array([-12.2, 0., 2.2, 29., -26.6, 0.])
        x = [[x]]
        preds = model.predict_classes(x)
    return "The predicted class of given weather is "+str(preds)


if __name__ == '__main__':
    loading_model()
    app.run()
