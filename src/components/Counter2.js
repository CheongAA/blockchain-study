import React, { useRef, useState } from "react";
import Web3 from "web3";
import counterAbi from "../config/counter2Abi.json";

const Counter2 = () => {
  const web3 = new Web3(process.env.REACT_APP_HTTP_PROVIDER);
  const contract = new web3.eth.Contract(
    counterAbi,
    process.env.REACT_APP_CONTRACT_ADDRESS2
  );

  const inputRef = useRef();
  const [number, setNumber] = useState();
  const [gasLimit, setGasLimit] = useState();

  const getCounter = async () => {
    const counter = await contract.methods.count().call();
    setNumber(counter);
  };

  const createTx = async (abi, from) => {
    try {
      const obj = {
        from: from ?? undefined,
        to: process.env.REACT_APP_CONTRACT_ADDRESS2,
        data: abi,
      };
      const gas = await web3.eth.estimateGas(obj);
      setGasLimit(gas);
      const tx = { ...obj, gas };

      const signed = await web3.eth.accounts.signTransaction(
        tx,
        process.env.REACT_APP_ADDRESS_PK
      );
      const { blockHash } = await web3.eth.sendSignedTransaction(
        signed?.rawTransaction
      );
      alert(blockHash);
    } catch (e) {
      alert("error");
      console.log(e);
    }
  };

  return (
    <div>
      <button type="button" onClick={getCounter}>
        Counter 조회하기
      </button>
      <button
        type="button"
        onClick={() => createTx(contract.methods.add().encodeABI())}
      >
        Counter 더하기
      </button>
      <br />
      <input ref={inputRef} />
      <button
        type="button"
        onClick={() =>
          createTx(
            contract.methods.addWithCount(inputRef?.current.value).encodeABI()
          )
        }
      >
        Counter 숫자 정해서 더하기
      </button>
      <br />
      <button
        type="button"
        onClick={() => createTx(contract.methods.minus().encodeABI())}
      >
        Counter 빼기
      </button>
      <button
        type="button"
        onClick={() =>
          createTx(
            contract.methods.reset().encodeABI(),
            "0x6433253fd4632ff5c8a5BF4BC93e43c22A194E25"
          )
        }
      >
        Counter 초기화하기
      </button>
      <p> gasLimit: {gasLimit}</p>
      <p> number: {number}</p>
    </div>
  );
};

export default Counter2;
