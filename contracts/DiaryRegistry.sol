// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DiaryRegistry {
    struct Entry {
        string ipfsHash;
        uint256 timestamp;
    }

    mapping(address => Entry[]) private userEntries;
    event EntryAdded(address indexed user, string ipfsHash, uint256 timestamp);

    function addEntry(string memory _ipfsHash) public {
        userEntries[msg.sender].push(Entry({
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp
        }));
        
        emit EntryAdded(msg.sender, _ipfsHash, block.timestamp);
    }

    function getMyEntries() public view returns (Entry[] memory) {
        return userEntries[msg.sender];
    }
}