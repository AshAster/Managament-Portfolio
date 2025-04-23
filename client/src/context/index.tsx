import { createContext, useEffect, useState, ReactNode } from "react";

type Currency = {
  name: string;
  symbol: string;
};

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: {
    large: string;
  };
  market_cap_rank: number;
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    high_24h: Record<string, number>;
    low_24h: Record<string, number>;
  };
  // Add any other properties used in your app
};

type CoinContextType = {
  allCoin: Coin[];
  currency: Currency;
  setCurrency: React.Dispatch<React.SetStateAction<Currency>>;
};

export const CoinContext = createContext<CoinContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const CoinContextProvider = ({ children }: Props) => {
  const [allCoin, setAllCoin] = useState<Coin[]>([]);
  const [currency, setCurrency] = useState<Currency>({
    name: "usd",
    symbol: "$",
  });

  const fetchAllCoin = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": "CG-96M6wLXSRWMiu34VFkSHNgaA",
          },
        }
      );
      const data = await res.json();
      setAllCoin(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllCoin();
  }, [currency]);

  return (
    <CoinContext.Provider value={{ allCoin, currency, setCurrency }}>
      {children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;
