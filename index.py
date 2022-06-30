from flask import Flask, render_template

app = Flask(__name__)  # name for flask app


# welcome screen
@app.route("/", methods=['GET', 'POST', 'PUT'])
def index():  # route handler
    # return a response
    return render_template('index.html')


@app.route("/goals_and_guidelines", methods=['GET', 'POST', 'PUT'])
def goals():
    return render_template('tutorial.html')


@app.route("/recording_step_1", methods=['GET', 'POST', 'PUT'])
def rec1():
    return render_template('recording.html')


if __name__ == "__main__":
    app.run(debug=True)  # runs the app with server, toggle debug on and off
