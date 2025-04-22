import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "@/components/FlexBetween";
import PixIcon from "@mui/icons-material/Pix";
import { CoinContext } from "@/context";
import "./navbar.css";


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

  const { palette } = useTheme();
  const [selected, setSelected] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
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

        {/* Home Button */}
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

        <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
          <Link
            to="/wallet"
            onClick={() => setSelected("wallet")}
            style={{
              color: selected === "wallet" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
            }}
          >
            wallet
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
  );
};

export default Navbar;
