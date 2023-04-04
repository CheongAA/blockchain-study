import React from "react";
import { useState } from "react";
import Web3 from "web3";

const web3 = new Web3(process.env.REACT_APP_HTTP_PROVIDER);
const account = web3.eth.accounts.privateKeyToAccount(
  process.env.REACT_APP_ADDRESS_PK
);
web3.eth.accounts.wallet.add(account);

const EtherTxForm = () => {
  const [txForm, setTxForm] = useState({ address: "", value: 0 });
  const [tx, setTx] = useState("");

  const onInputChange = (e) => {
    setTxForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onTx = async (e) => {
    e.preventDefault();
    const tx = {
      from: account.address,
      to: txForm.address,
      value: web3.utils.toWei(txForm.value, "ether"),
      gas: 21000,
      gasPrice: web3.utils.toWei("143", "gwei"),
      nonce: await web3.eth.getTransactionCount(account.address),
    };
    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      account.privateKey
    );
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    setTx(receipt.transactionHash);
  };

  return (
    <div>
      <form onSubmit={onTx}>
        <input required type="text" name="address" onChange={onInputChange} />
        <input
          required
          type="number"
          step="0.0001"
          name="value"
          onChange={onInputChange}
        />
        <button type="submit">전송</button>
      </form>
      <p>{tx}</p>
    </div>
  );
};

export default EtherTxForm;
