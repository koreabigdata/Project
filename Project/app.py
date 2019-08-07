from flask import Flask,render_template

app = Flask(__name__)

mt_example = ['아차산','관악산','남산']
@app.route('/')
def hello_world():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
