from flask import Flask, render_template
import subprocess

app = Flask(__name__)  # name for flask app


# welcome screen
@app.route("/", methods=['GET', 'POST', 'PUT'])
def index():
    return render_template('index.html',)


@app.route("/goals_and_guidelines")
def goals():
    return render_template('tutorial.html')


@app.route("/editing", methods=['POST', 'GET'])
def edit_video():
    return render_template('editing.html')


if __name__ == "__main__":
    app.run(debug=True)  # runs the app with server, toggle debug on and off
