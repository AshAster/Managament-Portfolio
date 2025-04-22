import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "@/components/FlexBetween";
import PixIcon from "@mui/icons-material/Pix";
import { CoinContext } from "@/context";
import "./navbar.css";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import WalletConnection from "@/scenes/wallet"
import { ethers } from "ethers";

type Props = {};

const Navbar = (props: Props) => {
  const { setCurrency } = useContext(CoinContext);
  const currencyHandler = (event) => {
    switch (event.target.value) {
      case "usd":
        setCurrency({ name: "usd", symbol: "$" });
        break;
      case "eur":
        setCurrency({ name: "eur", symbol: "€" });
        break;
      case "inr":
        setCurrency({ name: "inr", symbol: "₹" });
        break;
      default:
        setCurrency({ name: "usd", symbol: "$" });
        break;
    }
  };

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(true);

  // Check for MetaMask when component mounts and when modal opens
  useEffect(() => {
    setHasMetaMask(!!window.ethereum);
  }, [showWalletModal]);

  const handleConnectWallet = (e) => {
    e.preventDefault();
    setShowWalletModal(true);
  };

  const handleWalletConnect = (address: string, provider: ethers.providers.Web3Provider) => {
    console.log('Connected wallet:', address);
    // You might want to store this in your app state/context
  };

  const handleWalletDisconnect = () => {
    console.log('Wallet disconnected');
    // Handle disconnection in your app state/context
  };

  const { palette } = useTheme();
  const [selected, setSelected] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <FlexBetween mb="0.25rem" p="0.5rem 0rem" color={palette.grey[300]}>
        {/* LEFT SIDE */}
        <Link
          to={"/"}
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <FlexBetween gap="0.75rem">
            <PixIcon sx={{ fontSize: "28px" }} />
            <Typography variant="h4" fontSize="16px">
              CryptoMoon
            </Typography>
          </FlexBetween>
        </Link>

        {/* HAMBURGER MENU */}
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        {/* RIGHT SIDE */}
        <FlexBetween className={`Right-Side ${menuOpen ? "open" : ""}`} gap="2rem">
          <Box>
            <select
              className="nav-currency"
              onClick={currencyHandler}
              style={{
                padding: "5px 8px",
                borderRadius: "6px",
                border: "2px solid white",
                background: "transparent",
                color: "white",
              }}
            >
              <option value="usd" style={{ backgroundColor: "#1f2026", color: "white" }}>
                USD
              </option>
              <option value="eur" style={{ backgroundColor: "#1f2026", color: "white" }}>
                EUR
              </option>
              <option value="inr" style={{ backgroundColor: "#1f2026", color: "white" }}>
                INR
              </option>
            </select>
          </Box>

          {/* Wallet Button */}
          <Box>
            <button
              onClick={handleConnectWallet}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textDecoration: "none",
                color: "inherit",
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FlexBetween gap="0.75rem">
                <AccountBalanceWalletIcon sx={{ fontSize: "28px" }} />
                <Typography variant="h4" fontSize="16px">
                  Wallet
                </Typography>
              </FlexBetween>
            </button>
          </Box>
          
          <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
            <Link
              to="/"
              onClick={() => setSelected("home")}
              style={{
                color: selected === "home" ? "inherit" : palette.grey[700],
                textDecoration: "inherit",
              }}
            >
              Home
            </Link>
          </Box>

          {/* Dashboard Button */}
          <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
            <Link
              to="/dashboard"
              onClick={() => setSelected("dashboard")}
              style={{
                color: selected === "dashboard" ? "inherit" : palette.grey[700],
                textDecoration: "inherit",
              }}
            >
              Dashboard
            </Link>
          </Box>

          {/* Predictions Button */}
          <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
            <Link
              to="/predictions"
              onClick={() => setSelected("predictions")}
              style={{
                color: selected === "predictions" ? "inherit" : palette.grey[700],
                textDecoration: "inherit",
              }}
            >
              Predictions
            </Link>
          </Box>
        </FlexBetween>
      </FlexBetween>

      {/* Wallet Connection Modal - Rendered at root level */}
      <WalletConnection 
        showModal={showWalletModal}
        onCloseModal={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
        onDisconnect={handleWalletDisconnect}
        hasMetaMask={hasMetaMask}
      />
    </>
  );
};

export default Navbar;