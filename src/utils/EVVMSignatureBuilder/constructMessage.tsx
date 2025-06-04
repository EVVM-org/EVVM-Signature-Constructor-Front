/**
 * Constructs a message for depositing funds in EVVM Fisher
 * @param isERC20 - Whether the token is an ERC20 token or native currency
 * @param receiverAddress - Address that will receive the deposit
 * @param nonce - Unique number to prevent replay attacks
 * @param tokenAddress - Address of the token contract (only for ERC20)
 * @param priorityFee - Fee amount for transaction priority
 * @param ammount - Amount of tokens/currency to deposit
 * @returns Formatted message string for Fisher deposit
 */
function constructMessageForDepositFisher(
  isERC20: boolean,
  receiverAddress: string,
  nonce: string,
  tokenAddress: string,
  priorityFee: string,
  ammount: string
): string {
  // For ERC20 tokens, include token address in the message
  // For native currency, exclude token address
  return isERC20
    ? `${receiverAddress.toLowerCase()},${nonce},${tokenAddress.toLowerCase()},${priorityFee},${ammount}`
    : `${receiverAddress.toLowerCase()},${nonce},${priorityFee},${ammount}`;
}

/*
┏━━━━━━━━━━━━━━━━┓
 EVVM Signatures  
┗━━━━━━━━━━━━━━━━┛
*/
//・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈

/**
 * Construct a message for payMateStaking_async/sync or payNoMateStaking_async/sync in EVVM
 * @param to address of the receiver
 * @param tokenAddress address of the token
 * @param amount amount of the token
 * @param priorityFee priority fee of the transaction
 * @param nonce nonce of the transaction
 * @param priorityFlag priority of the transaction
 * @param executor executor of the transaction
 * @returns message for payMateStaking_async/sync or payNoMateStaking_async/sync
 */
function buildMessageSignedForPay(
  to: string,
  tokenAddress: string,
  amount: string,
  priorityFee: string,
  nonce: string,
  priorityFlag: boolean,
  executor: string
): string {
  const msg =
    // is the function signature for async or sync nonce respectively
    `${priorityFlag === true ? "f4e1895b" : "4faa1fa2"},` +
    // check if is a address or a username if is use toLowerCase()
    // to avoid case sensitivity issues to the address and if it isn't
    // use the username as it is
    `${to.startsWith("0x") ? to.toLowerCase() : to},` +
    // the token address is always an address so we use toLowerCase() to avoid case sensitivity issues
    `${tokenAddress.toLowerCase()},` +
    // the amount is set all in decimal format
    `${amount},` +
    // the priority fee is set all in decimal format
    `${priorityFee},` +
    // the nonce to avoid replay attacks
    `${nonce},` +
    // the priority flag is set to "true" or "false" as a string
    // false sync payment and true async payment
    `${priorityFlag ? "true" : "false"},` +
    // the executor is the address of the fisher or service that will execute the transaction
    // we use toLowerCase() to avoid case sensitivity issues
    `${executor.toLowerCase()}`;
  return msg;
}

/**
 * Builds a formatted message string for dispersed payment signing.
 *
 * This function constructs a message by concatenating a fixed prefix with various
 * payment parameters, separated by commas. Token and executor addresses are
 * normalized to lowercase for consistency.
 *
 * @param fixedHashedEncodedData - The fixed hashed encoded data used as a base for the message
 * @param TokenAddress - The token contract address (will be converted to lowercase)
 * @param Ammount - The payment amount as a string
 * @param PriorityFee - The priority fee amount as a string
 * @param Nonce - The transaction nonce value as a string
 * @param PriorityConverted - Boolean flag indicating if priority has been converted
 * @param Executor - The executor address (will be converted to lowercase)
 *
 * @returns A formatted string starting with 'ef83c1d6' followed by comma-separated parameters
 */
function buildMessageSignedForDispersePay(
  hashedEncodedData: string,
  tokenAddress: string,
  amount: string,
  priorityFee: string,
  nonce: string,
  priorityFlag: boolean,
  executor: string
): string {
  return (
    // is the function signature for disperse pay
    `ef83c1d6` +
    // the hashed encoded data is the second parameter 
    // we use toUpperCase() to avoid case sensitivity issues and slice(2) to remove the '0X'
    // and set the `0x` prefix 
    `${"0x" + hashedEncodedData.toUpperCase().slice(2)},` +
    // the token address is always an address so we use toLowerCase() to avoid case sensitivity issues
    `${tokenAddress.toLowerCase()},` +
    // the amount is set all in decimal format
    `${amount},` +
    // the priority fee is set all in decimal format
    `${priorityFee},` +
    // the nonce to avoid replay attacks
    `${nonce},` +
    // the priority flag is set to "true" or "false" as a string
    `${priorityFlag ? "true" : "false"},` +
    // the executor is the address of the fisher or service that will execute the transaction
    // we use toLowerCase() to avoid case sensitivity issues
    `${executor.toLowerCase()}`
  );
}

//・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈
/*
┏━━━━━━━━━━━━━━━━━┓
 sMate Signatures  
┗━━━━━━━━━━━━━━━━━┛
*/
//・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈

function buildMessageSignedForPublicStaking(
  isStaking: boolean,
  amountOfSMate: string,
  nonce: string
): string {
  return (
    "21cc1749," +
    `${isStaking ? "true" : "false"},` +
    `${amountOfSMate},` +
    `${nonce}`
  );
}

function buildMessageSignedForPresaleStaking(
  isStaking: boolean,
  amountOfSMate: string,
  nonce: string
): string {
  return (
    "6257deec," +
    `${isStaking ? "true" : "false"},` +
    `${amountOfSMate},` +
    `${nonce}`
  );
}

function buildMessageSignedForPublicServiceStaking(
  serviceAddress: string,
  isStaking: boolean,
  amountOfSMate: string,
  nonce: string
): string {
  return (
    "21cc1749," +
    `${serviceAddress.toLowerCase()},` +
    `${isStaking ? "true" : "false"},` +
    `${amountOfSMate},` +
    `${nonce}`
  );
}
export {
  constructMessageForDepositFisher,
  buildMessageSignedForPay,
  buildMessageSignedForDispersePay,
  buildMessageSignedForPublicStaking,
  buildMessageSignedForPresaleStaking,
  buildMessageSignedForPublicServiceStaking,
};
