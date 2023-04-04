import { useRef, useState } from "react";
import Web3 from "web3";

function App() {
  const web3 = new Web3(Web3.givenProvider);
  const inputRef = useRef();

  const [account, setAccount] = useState({ address: "", privateKey: "" });
  const [importedAccount, setImportedAccount] = useState("");
  const [balance, setBalance] = useState(0);

  const createAccount = () => {
    const { address, privateKey } = web3.eth.accounts.create();
    setAccount({ address, privateKey });
  };

  const getAddressByPk = () => {
    try {
      const { address } = web3.eth.accounts.privateKeyToAccount(
        inputRef?.current.value
      );
      setImportedAccount(address);
    } catch (e) {
      alert("private key 형식을 맞춰주세요");
    }
  };

  const getBalance = async () => {
    const provider = new Web3.providers.HttpProvider(
      process.env.REACT_APP_HTTP_PROVIDER
    );
    const web3 = new Web3(provider);
    const balance = await web3.eth.getBalance(
      "0x6433253fd4632ff5c8a5BF4BC93e43c22A194E25"
    );
    const ether = Web3.utils.fromWei(balance, "ether");
    setBalance(ether);
  };

  return (
    <div className="App">
      <div>
        <h1>1. 주소 생성</h1>
        <button type="button" onClick={createAccount}>
          가져오기
        </button>

        <p>
          address: {account.address}
          <br />
          pk: {account.privateKey}
        </p>
      </div>

      <div>
        <h1>2. 키 import / ETH Faucet / ETH 밸런스 조회</h1>
        <input ref={inputRef} type="text" />
        <button type="button" onClick={getAddressByPk}>
          주소 조회하기
        </button>
        <p> address: {importedAccount}</p>

        <button type="button" onClick={getBalance}>
          잔액 조회하기
        </button>
        <p> address: 0x6433253fd4632ff5c8a5BF4BC93e43c22A194E25</p>
        <p> balance: {balance}</p>
      </div>
    </div>
  );
}

export default App;
