from flask import Flask, render_template, send_from_directory
import editing.routes
import os

app = Flask(__name__)  # name for flask app
app.register_blueprint(editing.routes.editing, url_prefix='/editing')


# welcome screen
@app.route("/", methods=['GET'])
def index():
    return render_template('index.html')


@app.route("/img/favicon.ico", methods=['GET'])
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route("/goals_and_guidelines")
def goals():
    return render_template('tutorial.html')


if __name__ == "__main__":
    app.run(debug=True)  # runs the app with server, toggle debug on and off
