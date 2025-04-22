import React, { useEffect } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import { Player } from "@lottiefiles/react-lottie-player";
import "./wallet.css";
const MetaMaskOnboardingPage = () => {
  useEffect(() => {
    const onboarding = new MetaMaskOnboarding();

    const btn = document.querySelector(".onboard") as HTMLAnchorElement;
    const statusText = document.querySelector("h1");
    const statusDesc = document.querySelector(".desc");
    const loader = document.querySelector(".loader") as HTMLElement;
    const upArrow = document.querySelector(".up") as HTMLElement;
    const confetti = document.querySelector(".confetti") as HTMLElement;
    const player = document.querySelector(".success-anim") as any;

    const isMetaMaskInstalled = () => {
      const { ethereum } = window as any;
      return Boolean(ethereum && ethereum.isMetaMask);
    };

    const connected = (accounts: string[]) => {
      if (!statusText || !statusDesc || !btn) return;
      statusText.innerHTML = "Connected!";
      statusDesc.classList.add("account");
      statusDesc.innerHTML = accounts[0];
      btn.style.display = "none";
      loader.style.display = "none";
      upArrow.style.display = "none";
      confetti.style.display = "block";
      player?.play?.();
    };

    const connectWallet = async () => {
      const { ethereum } = window as any;
      return await ethereum.request({ method: "eth_accounts" });
    };

    const onClickInstallMetaMask = () => {
      onboarding.startOnboarding();
      loader.style.display = "block";
    };

    if (btn) {
      btn.addEventListener("click", async () => {
        btn.style.backgroundColor = "#cccccc";
        loader.style.display = "block";

        try {
          const { ethereum } = window as any;
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          connected(accounts);
        } catch (error) {
          console.error(error);
        }
      });
    }

    const MetaMaskClientCheck = () => {
      if (!isMetaMaskInstalled()) {
        statusText.innerText = "You need to Install a Wallet";
        statusDesc.innerText = "We recommend the MetaMask wallet.";
        btn.innerText = "Install MetaMask";
        btn.onclick = onClickInstallMetaMask;
      } else {
        connectWallet().then((accounts) => {
          if (accounts && accounts[0]) {
            connected(accounts);
          } else {
            statusText.innerHTML = "Connect your wallet";
            statusDesc.innerHTML = `To begin, please connect your MetaMask wallet.`;
            btn.innerText = "Connect MetaMask";
            upArrow.style.display = "block";
          }
        });
      }
    };

    MetaMaskClientCheck();
  }, []);

  return (
    <div className="onboard-container" style={{ textAlign: "center", padding: "2rem" }}>
      <div className="loader" style={{ marginBottom: "1rem" }}>
        <Player
          src="https://assets2.lottiefiles.com/private_files/lf30_lndg7fhf.json"
          background="transparent"
          speed={1}
          loop
          autoplay
          style={{ height: "120px", width: "120px" }}
        />
      </div>

      <div className="up" style={{ marginBottom: "1rem", display: "none" }}>
        <Player
          src="https://assets3.lottiefiles.com/packages/lf20_kfzgxkvq.json"
          background="transparent"
          speed={1}
          loop
          autoplay
          style={{ height: "100px", width: "100px" }}
        />
      </div>

      <div className="confetti" style={{ display: "none" }}>
        <Player
          className="success-anim"
          src="https://assets10.lottiefiles.com/packages/lf20_rovf9gzu.json"
          background="transparent"
          speed={1}
          style={{ height: "160px", width: "160px" }}
        />
      </div>

      <h1></h1>
      <p className="desc" style={{ fontSize: "1.1rem", color: "#ddd" }}></p>
      <a
        href="#"
        className="onboard"
        style={{
          display: "inline-block",
          marginTop: "1rem",
          padding: "0.75rem 1.5rem",
          borderRadius: "8px",
          backgroundColor: "#f6851b",
          color: "white",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      ></a>
    </div>
  );
};

export default MetaMaskOnboardingPage;
