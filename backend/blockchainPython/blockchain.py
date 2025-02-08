from web3 import Web3
import os
from dotenv import load_dotenv

load_dotenv()
sepoliaUrl = os.getenv("SEPOLIA_RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
web3 = Web3(Web3.HTTPProvider(sepoliaUrl))


if web3.is_connected():
    print("Connected.")
else:
    print("No connection.")


contract_address = "0x9eeCA8AaE9B83b95aF2C44B88e997AfeB409bB9c"
contract_abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"bytes32","name":"newHash","type":"bytes32"},{"indexed":True,"internalType":"address","name":"storedBy","type":"address"}],"name":"HashStored","type":"event"},{"inputs":[],"name":"getHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"newHash","type":"bytes32"}],"name":"storeHash","outputs":[],"stateMutability":"nonpayable","type":"function"}]

# Load contract
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

account = web3.eth.account.from_key(PRIVATE_KEY)


def store_review_hash(review_text):
    """
    Generates a SHA-256 hash of the review and stores it on Ethereum.
    """
    review_hash = Web3.to_bytes(hexstr=Web3.keccak(text=review_text).hex())

    # Get transaction count (nonce)
    nonce = web3.eth.get_transaction_count(account.address)

    # Build transaction
    txn = contract.functions.storeHash(review_hash).build_transaction({
        'from': account.address,
        'gas': 200000,
        'gasPrice': web3.eth.gas_price,
        'nonce': nonce,
    })

    # Sign transaction
    signed_txn = web3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
    tx_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)

    print(f"✅ Review Hash Stored! Transaction: {web3.to_hex(tx_hash)}")


def get_latest_review_hash():
    """
    Retrieves the latest stored review hash from Ethereum.
    """
    latest_hash = contract.functions.getHash().call()
    print(f"🔍 Latest Stored Review Hash: {Web3.to_hex(latest_hash)}")
    return latest_hash


# Example Usage (You can remove this after testing)
if _name_ == "_main_":
    store_review_hash("This is a verified review.")
    get_latest_review_hash()