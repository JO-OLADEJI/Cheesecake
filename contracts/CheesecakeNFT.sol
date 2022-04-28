// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IWhitelist.sol";

contract CheesecakeNFT is ERC721Enumerable, Ownable {
	/**
	* @dev _baseTokenURI for computing {tokenURI}. If set, the resulting URI for each
	* token will be the concatenation of the `baseURI` and the `tokenId`.
	*/
	string private _baseTokenURI;
	uint256 public _price = 0.01 ether;
	uint256 public maxTokenIds;
	uint256 public tokenIds;
	bool public _paused;
	bool public presaleStarted;
	uint256 public presaleEnd;
	IWhitelist public whitelist;

	modifier onlyWhenNotPaused {
		require(!_paused, "CONTRACT_PAUSED");
		_;
	}

	/**
	* @dev ERC721 constructor takes in a `name` and a `symbol` to the token collection.
	* name in our case is `Crypto Devs` and symbol is `CD`.
	* Constructor for Crypto Devs takes in the baseURI to set _baseTokenURI for the collection.
	* It also initializes an instance of whitelist interface.
	*/
	constructor (string memory baseURI, address whitelistContract, uint256 maxSupply) ERC721("Cheesecake", "CHC") {
		_baseTokenURI = baseURI;
		whitelist = IWhitelist(whitelistContract);
        maxTokenIds = maxSupply;
	}

	/**
	* @dev startPresale starts a presale for the whitelisted addresses
    * @param _presaleTimer represents the duration of the presale in seconds
	*/
	function startPresale(uint256 _presaleTimer) public onlyOwner {
		presaleStarted = true;
		presaleEnd = block.timestamp + _presaleTimer;
	}

	/**
	* @dev presaleMint allows a user to mint one NFT per transaction during the presale.
	*/
	function presaleMint() public payable onlyWhenNotPaused {
		require(presaleStarted && block.timestamp < presaleEnd, "PRESALE_NOT_RUNNING");
		require(whitelist.whitelistedAddresses(msg.sender), "ADDRESS_NOT_WHITELISTED");
		require(tokenIds < maxTokenIds, "MAX_SUPPLY_REACHED");
		require(msg.value >= _price, "INSUFFCIENT_ETHER_SENT");
		tokenIds += 1;
		_safeMint(msg.sender, tokenIds);
	}

	/**
	* @dev mint allows a user to mint 1 NFT per transaction after the presale has ended.
	*/
	function mint() public payable onlyWhenNotPaused {
		require(presaleStarted && block.timestamp >=  presaleEnd, "PRESALE_NOT_ENDED");
		require(tokenIds < maxTokenIds, "MAX_SUPPLY_REACHED");
		require(msg.value >= _price, "INSUFFCIENT_ETHER_SENT");
		tokenIds += 1;
		_safeMint(msg.sender, tokenIds);
	}

	/**
	* @dev _baseURI overides the Openzeppelin's ERC721 implementation which by default returned an empty string for the baseURI
	*/
	function _baseURI() internal view virtual override returns (string memory) {
		return _baseTokenURI;
	}

	/**
	* @dev setPaused makes the contract paused or unpaused
	*/
	function setPaused(bool val) public onlyOwner {
		_paused = val;
	}

	/**
	* @dev withdraw sends all the ether in the contract
	* to the owner of the contract
	*/
	function withdraw() public onlyOwner  {
		address _owner = owner();
		uint256 amount = address(this).balance;
		(bool sent, ) =  _owner.call{value: amount}("");
		require(sent, "FAILED_TO_SEND_ETHER");
	}

    /**
     * @dev function to receive Ether. msg.data must be empty
     */
	receive() external payable {}

    /**
     * @dev fallback function is called when msg.data is not empty
     */
	fallback() external payable {}
}
