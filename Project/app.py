from flask import Flask,render_template, request

app = Flask(__name__)

mt_example = ['아차산','관악산','남산']

@app.route('/')
@app.route('/<task>')
def hello_world(task=''):
    return render_template('index.html', task=task)


if __name__ == '__main__':
    app.run()
