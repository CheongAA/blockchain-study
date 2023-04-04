import React, { useState } from "react";
import Web3 from "web3";
import counterAbi from "../config/counterAbi.json";

const Counter = () => {
  const web3 = new Web3(process.env.REACT_APP_HTTP_PROVIDER);
  const contract = new web3.eth.Contract(
    counterAbi,
    process.env.REACT_APP_CONTRACT_ADDRESS
  );

  const [number, setNumber] = useState();

  const getCounter = async () => {
    const counter = await contract.methods.count().call();
    setNumber(counter);
  };

  const createTx = async (abi) => {
    const obj = {
      to: process.env.REACT_APP_CONTRACT_ADDRESS,
      data: abi,
    };
    const gas = await web3.eth.estimateGas(obj);
    const tx = { ...obj, gas };

    const signed = await web3.eth.accounts.signTransaction(
      tx,
      process.env.REACT_APP_ADDRESS_PK
    );
    const { blockHash } = await web3.eth.sendSignedTransaction(
      signed?.rawTransaction
    );

    return blockHash;
  };

  const plus = async () => {
    try {
      const tx = await createTx(contract.methods.add().encodeABI());
      alert(tx);
    } catch (e) {
      alert("error");
    }
  };

  const minus = async () => {
    try {
      const tx = await createTx(contract.methods.minus().encodeABI());
      alert(tx);
    } catch (e) {
      alert("error");
    }
  };

  return (
    <div>
      <button type="button" onClick={getCounter}>
        Counter 조회하기
      </button>
      <button type="button" onClick={plus}>
        Counter 더하기
      </button>
      <button type="button" onClick={minus}>
        Counter 빼기
      </button>
      <p> number: {number}</p>
    </div>
  );
};

export default Counter;
