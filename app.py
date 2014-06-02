from flask import Flask, request, jsonify, render_template
from flask_cors import cross_origin

from wit import Wit
from xbmcjson import XBMC

from lib.XBMCRouter import XBMCRouter
import private

app = Flask(__name__)


@app.route('/')
def serve_homepage():
    return render_template('app.html')


@app.route("/handle_message")
@cross_origin()
def handle_message():
    conn = XBMC('http://{}:{}/jsonrpc'.format(
        private.XBMC_HOST, private.XBMC_PORT))
    router = XBMCRouter(conn)

    message = request.args.get('q')
    if message:
        w = Wit(private.WIT_TOKEN)
        result = w.get_message(message)
        xbmc_result = router.route(result)

        return jsonify(xbmc_result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
