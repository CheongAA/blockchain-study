import { useRef, useState } from "react";
import Web3 from "web3";

function App() {
  const web3 = new Web3(Web3.givenProvider);

  const [account, setAccount] = useState({ address: "", privateKey: "" });
  const createAccount = () => {
    const { address, privateKey } = web3.eth.accounts.create();
    setAccount({ address, privateKey });
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
    </div>
  );
}

export default App;
