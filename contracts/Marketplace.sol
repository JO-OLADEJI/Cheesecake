// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Marketplace setup for DAO to purchase "fake" NFTs
 */
contract Marketplace {

    mapping(uint => address) public tokens;
    uint256 public nftPrice = 0.01 ether;

    /**
     * @dev function to purchase a "fake" NFT
     * @notice the function reverts if NFT with the _tokenId is owned by a "non-null" address
     * @param _tokenId token ID of the NFT to purchase
     */
    function purchase(uint256 _tokenId) public payable {
        require(
            tokens[_tokenId] == address(0),
            "TOKEN_UNAVAILABLE"
        );
        require(
            msg.value >= nftPrice,
            "INSUFFICIENT_ETHER_SENT"
        );
        tokens[_tokenId] = msg.sender;
    }

    /**
     * @dev alternate function to get the price of a "fake" NFT
     * @return nftPrice
     */
    function getPrice() external view returns(uint256) {
        return nftPrice;
    }

    /**
     * @dev function to check if a "fake" NFT is available to be purchased
     * @param _tokenId token ID of the NFT
     * @return bool
     */
    function available(uint256 _tokenId) external view returns(bool) {
        return tokens[_tokenId] == address(0);
    }
}