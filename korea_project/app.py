from flask import Flask, render_template

app = Flask(__name__)



@app.route('/data/<int:x>')
def hello_world(x=None):
    return render_template('index.html')

@app.route('/')
def index():
    return render_template('index.html')



@app.errorhandler(404)
def error(err):
    return 'a'

if __name__ == '__main__':
    app.run()
