from flask import Flask, request, jsonify
from flask_cors import cross_origin

from wit import Wit

from lib.xbmc_handler import XBMCHandler
import private

app = Flask(__name__)

@app.route("/")
@cross_origin()
def get_message():
    xbmc = XBMCHandler(host=private.XBMC_HOST)
    xbmc.connect()

    message = request.args.get('message')
    if message:
        w = Wit(private.WIT_TOKEN)
        result = w.get_message(message)
        xbmc_result = xbmc.route(result)

        return jsonify(xbmc_result)

if __name__ == "__main__":
    app.run(debug=True)
