from flask import Flask, make_response, jsonify
from flask_cors import CORS
from utils import get_request_parameters, build_and_send_transaction
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)


@app.post('/')
def send():
    # Get the request data containing the transaction details
    parameters = get_request_parameters()
    # Get the transaction result
    receipt = build_and_send_transaction(parameters)
    # Check the result
    if receipt.status == 1:
        return make_response(jsonify({'message': 'transaction sent!'}), 200)
    else:
        return make_response(jsonify({'message': 'transaction sent'}), 500)


@app.errorhandler(500)
def internal_error(error):
    return 500


@app.errorhandler(404)
def not_found_error(error):
    return 404


# ----------------------------------------------------------------------------#
# Launch relayer .
# ----------------------------------------------------------------------------#
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
