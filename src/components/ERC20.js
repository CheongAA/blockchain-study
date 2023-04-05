import React, { useRef } from "react";
import { useState } from "react";
import Web3 from "web3";
import erc20Abi from "../config/erc20Abi.json";

const ERC20 = () => {
  const web3 = new Web3(process.env.REACT_APP_HTTP_PROVIDER);
  const contract = new web3.eth.Contract(
    erc20Abi,
    process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS
  );

  const balanceOfAddressInputRef = useRef();
  const addressInputRef = useRef();
  const amountInputRef = useRef();

  const [data, setData] = useState({
    name: "",
    symbol: "",
    decimals: "",
    totalSupply: "",
  });

  const executeMethod = async (method, param) => {
    const res = param
      ? await contract.methods[method](param).call()
      : await contract.methods[method]().call();
    setData((prev) => ({ ...prev, [method]: res }));
  };

  const getGasprice = async () => {
    const { fast, slow } = await (
      await fetch("https://ethgasstation.info/api/ethgasAPI.json")
    ).json();
    return { fast, slow };
  };

  const transferToken = async () => {
    const data = await contract.methods
      .transfer(addressInputRef.current?.value, amountInputRef.current?.value)
      .encodeABI();
    const estimateGas = await contract.methods
      .transfer(addressInputRef.current?.value, amountInputRef.current?.value)
      .estimateGas({ from: process.env.REACT_APP_ADDRESS });
    const nonce = await web3.eth.getTransactionCount(
      process.env.REACT_APP_ADDRESS
    );
    const { fast } = await getGasprice();

    const txObj = {
      nonce,
      data,
      to: process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS,
      gasLimit: estimateGas,
      gasPrice: web3.utils.toHex(web3.utils.toWei(fast.toString(), "gwei")),
    };

    const signed = await web3.eth.accounts.signTransaction(
      txObj,
      process.env.REACT_APP_ADDRESS_PK
    );
    if (signed?.rawTransaction) {
      const result = await web3.eth.sendSignedTransaction(
        signed.rawTransaction
      );
      alert(result.transactionHash);
    }
  };

  return (
    <div>
      {JSON.stringify(data)}
      <div>
        <button type="button" onClick={() => executeMethod("name")}>
          getName
        </button>
        <button type="button" onClick={() => executeMethod("symbol")}>
          getSymbol
        </button>
        <button type="button" onClick={() => executeMethod("decimals")}>
          getDecimals
        </button>
        <button type="button" onClick={() => executeMethod("totalSupply")}>
          getTotalSupply
        </button>
        <input id="address" ref={balanceOfAddressInputRef} type="text" />
        <button
          type="button"
          onClick={() =>
            executeMethod("balanceOf", balanceOfAddressInputRef.current?.value)
          }
        >
          getBalanceOf
        </button>
      </div>

      <hr />
      <div>
        <label htmlFor="address">address</label>
        <input id="address" ref={addressInputRef} type="text" />
        <input ref={amountInputRef} type="number" />
        <button type="button" onClick={transferToken}>
          transfer
        </button>
      </div>
    </div>
  );
};

export default ERC20;
