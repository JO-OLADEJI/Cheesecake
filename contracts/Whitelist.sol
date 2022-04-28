// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


contract Whitelist {

    uint8 public maxWhitelistedAddresses;
    mapping(address => bool) public whitelistedAddresses;
    uint8 public numAddressesWhitelisted;


	/**
	 * @dev function is called at the time of deployment
	 * @param _maxWhitelistedAddresses represent the maximum number of whitelisted addresses allowed
	 */
    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses =  _maxWhitelistedAddresses;
    }


    /**
     * @dev function adds the address of the sender to the whitelist
     */
    function addAddressToWhitelist() public {
        require(
			!whitelistedAddresses[msg.sender], 
			"ALREADY_WHITELISTED"
		);
        require(
			numAddressesWhitelisted < maxWhitelistedAddresses, 
			"WHITELIST_LIMIT_REACHED"
		);

        whitelistedAddresses[msg.sender] = true;
        numAddressesWhitelisted ++;
    }

}