from flask import Flask, request, jsonify, render_template
from flask_cors import cross_origin

from wit import Wit
from xbmcjson import XBMC

from lib.XBMCRouter import XBMCRouter
import private

app = Flask(__name__)


@app.route('/message')
@cross_origin()
def get_message():
    message = request.args.get('q')
    if message:
        w = Wit(private.WIT_TOKEN)
        result = w.get_message(message)
        return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
