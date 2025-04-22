import React, { useContext, useEffect, useState } from "react";
import { CoinContext } from "@/context";
import { Link } from "react-router-dom";
import "./Home.css"; 

type Props = {};

const Home = (props: Props) => {
  const { allCoin, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState("");

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    if (event.target.value === "") {
      setDisplayCoin(allCoin);
    }
  };

  const searchHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    const coins = allCoin.filter((item: any) =>
      item.name.toLowerCase().includes(input.toLowerCase())
    );
    setDisplayCoin(coins);
  };

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  return (
    <div className="home">
      <div className="hero">
        <h1> <br /> Crypto Manager</h1>
        <p>
          Welcome to the world's cryptocurrency marketplace. Sign up to
          explore more about cryptos.
        </p>

        <form onSubmit={searchHandler} className="search-form">
          <input 
            onChange={inputHandler} 
            value={input} 
            type="text" 
            placeholder="Search crypto.." 
            list="coinlist" 
            required 
          />
          <datalist id="coinlist">
            {allCoin.map((item: any, index: number) => (
              <option key={index} value={item.name} />
            ))}
          </datalist>
          <button type="submit">Search</button>
        </form>
      </div>

      <div to={`/coin/${displayCoin[0]?.id}`} className="crypto-table">
        {/* Table Header */}
        <div className="table-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p>24H Change</p>
          <p className="market-cap">Market Cap</p>
        </div>

        {/* Table Rows */}
        {displayCoin.slice(0, 10).map((item: any, index: number) => (
  <Link to={`/coin/${item.id}`} key={index} className="table-layout">
    <p>{item.market_cap_rank}</p>
    <div className="coin-info">
      <img src={item.image} alt={item.name} />
      <p>{item.name} - {item.symbol}</p>
    </div>
    <p>{currency.symbol} {item.current_price.toLocaleString()}</p>
    <p className={item.price_change_percentage_24h > 0 ? "positive" : "negative"}>
      {Math.floor(item.price_change_percentage_24h * 100) / 100}%
    </p>
    <p className="market-cap">{currency.symbol} {item.market_cap.toLocaleString()}</p>
  </Link>
))}
      </div>
    </div>
  );
};

export default Home;
