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
    </div>
  );
};

export default ERC20;
