function constructMessageForDepositFisher(
  isERC20: boolean,
  receiverAddress: string,
  nonce: string,
  tokenAddress: string,
  priorityFee: string,
  ammount: string
): string {
  return isERC20
    ? `${receiverAddress.toLowerCase()},${nonce},${tokenAddress.toLowerCase()},${priorityFee},${ammount}`
    : `${receiverAddress.toLowerCase()},${nonce},${priorityFee},${ammount}`;
}

/**
 *  Construct a message for payMateStaking_async/sync or payNoMateStaking_async/sync in EVVM
 *  @param to address of the receiver
 *  @param tokenAddress address of the token
 *  @param amount amount of the token
 *  @param priorityFee priority fee of the transaction
 *  @param nonce nonce of the transaction
 *  @param priorityFlag priority of the transaction
 *  @param executor executor of the transaction
 *  @returns message for payMateStaking_async/sync or payNoMateStaking_async/sync
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
    // the priority flag is set to true or false 
    // false sync payment and true async payment
    `${priorityFlag},` +
    // the executor is the address of the fisher or service that will execute the transaction
    // we use toLowerCase() to avoid case sensitivity issues
    `${executor.toLowerCase()}`;
  return msg;
}

/*


function constructMessageForDispersePay(
  fixedHashedEncodedData: string,
  TokenAddress: string,
  Ammount: string,
  PriorityFee: string,
  Nonce: string,
  PriorityConverted: boolean,
  Executor: string
): string {
  return (
    `${EvvmMethodIdentifier["dispersePay"]},` +
    `${fixedHashedEncodedData},` +
    `${TokenAddress.toLowerCase()},` +
    `${Ammount},` +
    `${PriorityFee},` +
    `${Nonce},` +
    `${PriorityConverted},` +
    `${Executor.toLowerCase()}`
  );
}


function constructMessageForPreRegistrationUsername(
  hashedUsername: string,
  nonceUsername: string
): string {
  return (
    `${MateNameServiceMethodIdentifier["preRegistrationUsername"]},` +
    `${hashedUsername},` +
    `${nonceUsername}`
  );
}

function constructMessageForRegistrationUsername(
  username: string,
  clowNumber: string,
  nonceUsername: string
): string {
  return (
    `${MateNameServiceMethodIdentifier["registrationUsername"]},` +
    `${username},` +
    `${clowNumber},` +
    `${nonceUsername}`
  );
}


function constructMessageForMakeOffer(
  username: string,
  expirationDate: string,
  amountOffering: string,
  nonceMakeOffer: string
): string {
  return (
    `${MateNameServiceMethodIdentifier["makeOffer"]},` +
    `${username},` +
    `${expirationDate},` +
    `${amountOffering},` +
    `${nonceMakeOffer}`
  );
}

function constructMessageForWithdrawOffer(
  username: string,
  id: string,
  nonceUser: string
): string {
  return (
    `${MateNameServiceMethodIdentifier["withdrawOffer"]},` +
    `${username},` +
    `${id},` +
    `${nonceUser}`
  );
}

function constructMessageForAcceptOffer(
  username: string,
  id: string,
  nonceUser: string
): string {
  return (
    `${MateNameServiceMethodIdentifier["acceptOffer"]},` +
    `${username},` +
    `${id},` +
    `${nonceUser}`
  );
}

function constructMessageForRenewUsername(
  username: string,
  nonceUser: string
): string {
  return (
    `${MateNameServiceMethodIdentifier["renewUsername"]},` +
    `${username},` +
    `${nonceUser}`
  );
}

function constructMessageForAddCustomMetadata(
  username: string,
  metadata: string,
  nonceUser: string
): string {
  return (
    `${MateNameServiceMethodIdentifier["addCustomMetadata"]},` +
    `${username},` +
    `${metadata},` +
    `${nonceUser}`
  );
}

function constructMessageForRemoveCustomMetadata(
  username: string,
  id: string,
  nonceUser: string
): string {
  return (
    `${MateNameServiceMethodIdentifier["removeCustomMetadata"]},` +
    `${username},` +
    `${id},` +
    `${nonceUser}`
  );
}

function constructMessageForFlushCustomMetadata(
  username: string,
  nonceUser: string
): string {
  return (
    `${MateNameServiceMethodIdentifier["flushCustomMetadata"]},` +
    `${username},` +
    `${nonceUser}`
  );
}

function constructMessageForWithdrawBridge(
  receiverAddress: string,
  tokenAddress: string,
  amount: string,
  priorityFee: string,
  priority: boolean
): string {
  return (
    `${
      priority === true
        ? EvvmMethodIdentifier["withdrawal_async"]
        : EvvmMethodIdentifier["withdrawal_sync"]
    },` +
    `${receiverAddress.toLowerCase()},` +
    `${tokenAddress.toLowerCase()},` +
    `${amount},` +
    `${priorityFee},` +
    `${priority}`
  );
}

function constructMessageForFisherWithdrawal(
  receiverAddress: string,
  nonce: string,
  tokenAddress: string,
  priorityFee: string,
  ammount: string
): string {
  return (
    `${receiverAddress.toLowerCase()},` +
    `${nonce},` +
    `${tokenAddress.toLowerCase()},` +
    `${priorityFee},` +
    `${ammount}`
  );
}
*/

export {
  constructMessageForDepositFisher,
  buildMessageSignedForPay,
  /*
  constructMessageForDispersePay,
  constructMessageForPreRegistrationUsername,
  constructMessageForRegistrationUsername,
  constructMessageForMakeOffer,
  constructMessageForWithdrawOffer,
  constructMessageForAcceptOffer,
  constructMessageForRenewUsername,
  constructMessageForAddCustomMetadata,
  constructMessageForRemoveCustomMetadata,
  constructMessageForFlushCustomMetadata,
  constructMessageForWithdrawBridge,
  constructMessageForFisherWithdrawal,
  */
};
