// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ICheesecakeNFT.sol";

contract CreamToken is ERC20, Ownable {

	uint256 public constant tokenPrice = 0.001 ether;
	uint256 public constant tokensPerNFT = 10 ether;
	uint256 public constant maxTotalSupply = 10000 ether;
	ICheesecakeNFT CheesecakeNFT;
	mapping(uint256 => bool) public tokenIdsClaimed;

	constructor(address _cheesecakeNftContract) ERC20("CreamToken", "CT") {
		CheesecakeNFT = ICheesecakeNFT(_cheesecakeNftContract);
	}

	/**
	* @dev Mints `amount` number of CreamTokens
	* Requirements:
	* - `msg.value` should be equal or greater than the tokenPrice * amount
	*/
	function mint(uint256 amount) public payable {
		uint256 _requiredAmount = tokenPrice * amount;
		uint256 amountWithDecimals = amount * 1 ether;
		require(
            msg.value >= _requiredAmount, 
            "INCORRECT_ETHER_SENT"
        );
		require(
			(totalSupply() + amountWithDecimals) <= maxTotalSupply,
			"MAX_SUPPLY_EXCEEDED"
		);
		_mint(msg.sender, amountWithDecimals);
	}


	/**
	* @dev Mints tokens based on the number of NFT's held by the sender
	* Requirements:
	* balance of Cheesecake NFT's owned by the sender should be greater than 0
	* Tokens should have not been claimed for all the NFTs owned by the sender
	*/
	function claim() public {
		address sender = msg.sender;
		uint256 balance = CheesecakeNFT.balanceOf(sender);
		require(
            balance > 0, 
            "ZERO_CHEESECAKE_OWNED"
        );
		uint256 amount = 0;
		for (uint256 i = 0; i < balance; i++) {
			uint256 tokenId = CheesecakeNFT.tokenOfOwnerByIndex(sender, i);
			if (!tokenIdsClaimed[tokenId]) {
				amount += 1;
				tokenIdsClaimed[tokenId] = true;
			}
		}
		require(
            amount > 0,
            "ALL_TOKENS_CLAIMED"
        );
		_mint(sender, amount * tokensPerNFT);
	}


    /**
     * @dev Function to receive Ether. msg.data must be empty
     */
	receive() external payable {}


    /**
     * @dev Fallback function is called when msg.data is not empty
     */
	fallback() external payable {}

}