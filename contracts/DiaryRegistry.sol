// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DiaryRegistry {
    struct DiaryEntry {
        string ipfsHash; // The CID from Pinata
        uint256 timestamp;
    }

    mapping(address => DiaryEntry[]) private userDiaries;

    function addEntry(string memory _ipfsHash) public {
        userDiaries[msg.sender].push(DiaryEntry(_ipfsHash, block.timestamp));
    }

    function getMyDiaries() public view returns (DiaryEntry[] memory) {
        return userDiaries[msg.sender];
    }
}