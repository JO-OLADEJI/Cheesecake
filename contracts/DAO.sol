// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ICheesecakeNFT.sol";
import "./interfaces/IMarketplace.sol";


contract DAO is Ownable {

	struct Proposal {
		uint256 nftTokenId;
		uint256 deadline;
		uint256 yayVotes;
		uint256 nayVotes;
		bool executed;
		mapping(uint256 => bool) voters;
	}

	enum Vote {
		YAY,
		NAY
	}

	mapping(uint256 => Proposal) public proposals;
	uint256 public numProposals;
	ICheesecakeNFT public cheesecakeNft;
	IFakeNFTMarketplace public fakeNftMarketplace;

	constructor (address cheesecakeContract, address marketplaceContract) payable {
		cheesecakeNft = ICheesecakeNFT(cheesecakeContract);
		fakeNftMarketplace = IFakeNFTMarketplace(marketplaceContract);
	}

	modifier onlyHolder {
		require(
			cheesecakeNft.balanceOf(msg.sender) > 0,
			"NOT_A_DAO_MEMBER"
		);
		_;
	}

	modifier onlyActiveProposals(uint256 proposalIndex) {
		require(
			proposals[proposalIndex].deadline > block.timestamp,
			"PROPOSAL_EXPIRED"
		);
		_;
	}

	modifier onlyInactiveProposals(uint256 proposalIndex) {
		require(
			block.timestamp > proposals[proposalIndex].deadline,
			"DEADLINE_NOT_REACHED"
		);
		require(
			proposals[proposalIndex].executed == false,
			"PROPOSAL_ALREADY_EXECUTED"
		);
		_;
	}	

	function createProposal(uint256 nftTokenId) external onlyHolder returns(uint256) {
		require(
			address(this).balance > fakeNftMarketplace.getPrice(),
			"INSUFFICIENT_BALANCE"
		);
		require(
			fakeNftMarketplace.available(nftTokenId),
			"TOKEN_UNAVAILABLE"
		);

		numProposals++;
		Proposal storage proposal = proposals[numProposals];
		proposal.nftTokenId = nftTokenId;
		proposal.deadline = block.timestamp + 10 minutes;

		return numProposals;
	}

	function voteOnProposal(uint256 proposalIndex, Vote decision) external onlyHolder onlyActiveProposals(proposalIndex) {
		Proposal storage proposal = proposals[proposalIndex];
		uint256 holderBalance = cheesecakeNft.balanceOf(msg.sender);
		uint256 validVotes;

		for (uint256 i = 0; i < holderBalance; i++) {
			uint256 tokenId = cheesecakeNft.tokenOfOwnerByIndex(msg.sender, i);
			if (proposal.voters[tokenId] == false) {
				proposal.voters[tokenId] = true;
				validVotes++;
			}
		}

		require(validVotes > 0, "ALREADY_VOTED");

		if (decision == Vote.YAY) {
			proposal.yayVotes += validVotes;
		}
		else if (decision == Vote.NAY) {
			proposal.nayVotes += validVotes;
		}
	}

	function executeProposal(uint256 proposalIndex) external onlyHolder onlyInactiveProposals(proposalIndex) {
		Proposal storage proposal = proposals[proposalIndex];
		
		if (proposal.yayVotes > proposal.nayVotes) {
			// execute
			uint256 nftPrice = fakeNftMarketplace.getPrice();
			require(
				fakeNftMarketplace.available(proposal.nftTokenId) == true,
				"NFT_NOT_AVAILABLE"
			);
			require(address(this).balance >= nftPrice,
				"NOT_ENOUGH_FUNDS"
			);
			fakeNftMarketplace.purchase{value: nftPrice}(proposal.nftTokenId);
		}
		proposal.executed = true;
	}

	function withdrawEther() external onlyOwner {
		(bool success, ) = msg.sender.call{value: address(this).balance}("");
		require(success, "WITHDRAW_FAILED");
	}

	receive() external payable {}

	fallback() external payable {}

}
