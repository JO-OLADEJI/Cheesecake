// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICheesecakeNFT {
    function tokenOfOwnerByIndex(address owner, uint index) external view returns(uint tokenId);
    function balanceOf(address owner) external view returns(uint256 balance);
}