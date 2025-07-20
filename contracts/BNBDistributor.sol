// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BNBDistributor
 * @dev Automatically distributes BNB payments to two recipients
 * @notice This contract accepts exactly 0.05 BNB and distributes it to two predefined addresses
 */
contract BNBDistributor {
    // Recipient addresses (immutable for security)
    address public constant RECIPIENT1 = 0xf52f981dafb26dc2ce86e48fbf6fbc2e35cd9444;
    address public constant RECIPIENT2 = 0x73D5906Cbf60ecD8b5C0F89ae25fbEabeFdc894E;
    
    // Payment amounts in wei (18 decimals)
    uint256 public constant TOTAL_AMOUNT = 50000000000000000; // 0.05 BNB
    uint256 public constant AMOUNT1 = 20000000000000000;     // 0.02 BNB
    uint256 public constant AMOUNT2 = 30000000000000000;     // 0.03 BNB
    
    // Events for tracking
    event PaymentDistributed(
        address indexed payer,
        uint256 totalAmount,
        uint256 amount1,
        uint256 amount2,
        uint256 timestamp
    );
    
    event EmergencyWithdrawal(
        address indexed withdrawer,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev Main function to distribute BNB payments
     * @notice Sends exactly 0.05 BNB to trigger distribution
     */
    function distribute() external payable {
        // Validate payment amount
        require(msg.value == TOTAL_AMOUNT, "Incorrect BNB amount: send exactly 0.05 BNB");
        
        // Transfer to first recipient
        (bool success1, ) = payable(RECIPIENT1).call{value: AMOUNT1}("");
        require(success1, "Transfer to recipient 1 failed");
        
        // Transfer to second recipient
        (bool success2, ) = payable(RECIPIENT2).call{value: AMOUNT2}("");
        require(success2, "Transfer to recipient 2 failed");
        
        // Emit event for tracking
        emit PaymentDistributed(
            msg.sender,
            TOTAL_AMOUNT,
            AMOUNT1,
            AMOUNT2,
            block.timestamp
        );
    }
    
    /**
     * @dev Get contract configuration information
     * @return recipient1 First recipient address
     * @return recipient2 Second recipient address
     * @return totalAmount Total payment amount required
     * @return amount1 Amount for first recipient
     * @return amount2 Amount for second recipient
     */
    function getContractInfo() external pure returns (
        address recipient1,
        address recipient2,
        uint256 totalAmount,
        uint256 amount1,
        uint256 amount2
    ) {
        return (RECIPIENT1, RECIPIENT2, TOTAL_AMOUNT, AMOUNT1, AMOUNT2);
    }
    
    /**
     * @dev Emergency function to withdraw stuck BNB
     * @notice Only recipients can withdraw in case of emergency
     */
    function emergencyWithdraw() external {
        require(
            msg.sender == RECIPIENT1 || msg.sender == RECIPIENT2, 
            "Only recipients can withdraw"
        );
        
        uint256 balance = address(this).balance;
        require(balance > 0, "No BNB to withdraw");
        
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "Emergency withdrawal failed");
        
        emit EmergencyWithdrawal(msg.sender, balance, block.timestamp);
    }
    
    /**
     * @dev Get current contract BNB balance
     * @return Current balance in wei
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Fallback function to reject direct BNB transfers
     * @notice Use distribute() function instead
     */
    receive() external payable {
        revert("Use distribute() function to send BNB");
    }
    
    /**
     * @dev Fallback function for invalid calls
     */
    fallback() external payable {
        revert("Function not found. Use distribute() to send BNB");
    }
}