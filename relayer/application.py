from flask import Flask, make_response, jsonify
from flask_cors import CORS
from utils import get_request_parameters,execute_register_transaction
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)


@app.post('/')
def send():
    # Get the request data containing the transaction details
    parameters = get_request_parameters()
    # Get the transaction result
    label, address=parameters.values()
    blockchains = ["GNOSIS", "SCROLL", "ARBITRUM", 'ZK_EVM']
    receipts = []
    for blockchain in blockchains:
        print(blockchain)
        receipt = execute_register_transaction(label,address,blockchain)
        receipts.append(receipt.status)
    # Check the result
    if all([receipt == 1 for receipt in receipts ]) :
        return make_response(jsonify({'message': 'transaction sent!'}), 200)
    else:
        return make_response(jsonify({'message': 'transaction failed'}), 500)


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
