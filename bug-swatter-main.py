from flask import Flask, render_template

app = Flask(__name__)  # name for flask app


# welcome screen
@app.route("/", methods=['GET', 'POST', 'PUT'])
def home():  # route handler
    # return a response
    return render_template('index.html')


app.run(debug=True)  # runs the app with server, toggle debug on and off
