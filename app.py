from flask import Flask, request, jsonify
from flask_cors import cross_origin

from wit import Wit

import private

app = Flask(__name__)

@app.route("/")
@cross_origin()
def get_message():
    message = request.args.get('message')
    if message:
        w = Wit(private.WIT_TOKEN)
        result = w.get_message(message)

        return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
