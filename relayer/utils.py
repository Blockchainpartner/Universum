from flask import request
from web3 import Web3
import json
import os
from dotenv import load_dotenv
from web3.middleware import geth_poa_middleware
load_dotenv()





def get_request_parameters():
    """
    Extracts the parameters from a Flask request.
    Returns a dictionary of parameters.
    """
    parameters = {}
    for key in request.args:
        parameters[key] = request.args.get(key)
    if request.is_json:
        data = request.get_json()
        if data:
            parameters.update(data)
    return parameters


def sanitize_sm_parameter(param):
    """
    Builds a sanitized tuple of parameters for a smart contract function call from a dictionary.

    :param param: A dictionary of parameter values.
    :type param: dict
    :returns A tuple of parameters for a smart contract function call.
    :rtype: tuple
    """
    return param['from'], param['to'], param['value'], param['gas'], int(param['nonce']), param['data']


def build_and_send_metatransaction(parameters, blockchain='OPTIMISM'):
    w3 = Web3(Web3.HTTPProvider(os.getenv(blockchain + '_RPC_PATH')))
    abi_path = os.path.join('ABIs', blockchain + '_forwarderABI.json')
    with open(abi_path, 'r') as f:
        abi = json.load(f)
    contract = w3.eth.contract(address=os.getenv(blockchain + '_CONTRACT_ADDRESS'), abi=abi)
    nonce = w3.eth.get_transaction_count(os.getenv('RELAYER_ADDRESS'))
    signature, data = parameters.values()
    sanitized_data = sanitize_sm_parameter(data)
    transaction = contract.functions.execute(sanitized_data, signature).build_transaction(
        { "nonce": nonce})
    signed_txn = w3.eth.account.sign_transaction(transaction, os.getenv('RELAYER_PRIVATE_KEY'))
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    # Wait for the transaction to be mined
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return receipt


def execute_register_transaction(label,address, blockchain):
    w3 = Web3(Web3.HTTPProvider(os.getenv(blockchain + '_RPC_PATH')))
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)
    abi_path = os.path.join('ABIs',  'Registrar_ABI.json')
    with open(abi_path, 'r') as f:
        abi = json.load(f)
    if blockchain == 'GNOSIS':
        contract = w3.eth.contract(address=os.getenv('REGISTRAR_CONTRACT_ADDRESS_GNOSIS'), abi=abi)
    else:
        contract = w3.eth.contract(address=os.getenv('REGISTRAR_CONTRACT_ADDRESS'), abi=abi)
    nonce = w3.eth.get_transaction_count(os.getenv('RELAYER_ADDRESS'))
    transaction_details = {"nonce": nonce}
    #set gas for
    if blockchain == "ARBITRUM":
        transaction_details["gasPrice"] = 150000000
        transaction_details["gas"] = 10000000
    if blockchain in ["GNOSIS","SCROLL", "ZK_EVM"]:
        transaction_details["gasPrice"] = 15000000000
        transaction_details["gas"] = 1000000
    transaction = contract.functions.register(label,address).build_transaction(
        transaction_details)
    signed_txn = w3.eth.account.sign_transaction(transaction, os.getenv('RELAYER_PRIVATE_KEY'))
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    # Wait for the transaction to be mined
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return receipt
