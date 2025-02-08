// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ReviewStorage {
    bytes32 public latestHash;
    address public owner;

    event HashStored(bytes32 indexed newHash, address indexed storedBy);

    constructor() {
        owner = msg.sender;
    }

    // Only the owner can update the hash
    function storeHash(bytes32 newHash) public {
        require(msg.sender == owner, "Not authorized");
        latestHash = newHash;
        emit HashStored(newHash, msg.sender);
    }

    function getHash() public view returns (bytes32) {
        return latestHash;
    }
}
