# 📈 Bazaar Pulse — Indian Stock Market Dashboard

A real-time NSE/BSE stock market dashboard built with **React** and **Recharts**.  
Tracks 8 major Indian blue-chip stocks with live price simulation, technical indicators, and IST timestamps.

---

## 🖥️ Demo

> Data is **simulated** for demo purposes. Not connected to a live API. Not SEBI investment advice.

---

## ✨ Features

- **Live ticking prices** — updates every 1.5 seconds (pause/resume toggle)
- **8 NSE stocks** — RELIANCE, TCS, HDFCBANK, INFY, WIPRO, TATAMOTORS, BAJFINANCE, ADANIENT
- **4 chart types** — Price (area), RSI, Volume, MACD
- **Technical indicators** — RSI(14), MACD(12,26,9), EMA
- **Indian formatting** — ₹ INR, Lakhs/Crores, `en-IN` locale
- **IST clock** — live Indian Standard Time in the header
- **Market cap** — calculated from approximate shares outstanding
- **Watchlist sidebar** — mini sparklines + % change per stock
- **Time range selector** — 30m · 1H · 2H · 3H window

---

## 🗂️ Project Structure

```
bazaar-pulse/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx       # Main orchestrator
│   │   ├── Watchlist.jsx       # Sidebar stock list
│   │   ├── ChartPanel.jsx      # 4-tab chart area
│   │   ├── MarketTable.jsx     # Overview table
│   │   ├── Sparkline.jsx       # Mini line chart
│   │   └── PriceTooltip.jsx    # Custom chart tooltip
│   ├── utils/
│   │   ├── stockData.js        # Stock universe, seeding, tick logic
│   │   ├── indicators.js       # RSI, EMA, MACD calculations
│   │   └── format.js           # INR formatters
│   ├── theme.js                # Colour palette
│   ├── App.js
│   └── index.js
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+ and npm

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/bazaar-pulse.git
cd bazaar-pulse

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app opens at **http://localhost:3000**

### Build for Production

```bash
npm run build
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Recharts | Charts (Area, Line, Bar) |
| JavaScript (ES6+) | Logic, indicators |
| CSS-in-JS (inline styles) | Theming |

---

## 📡 Connecting Real Market Data

To replace simulated data with live NSE/BSE prices, you can use:

- **[NSE India API](https://www.nseindia.com/)** — official NSE data (browser cookies required)
- **[Yahoo Finance](https://finance.yahoo.com/)** via `yfinance` Python library + a backend
- **[Alpha Vantage](https://www.alphavantage.co/)** — free tier available
- **[Twelve Data](https://twelvedata.com/)** — WebSocket support for real-time

Replace the `tickStock()` and `initStockData()` functions in `src/utils/stockData.js` with API calls.

---

## 📋 Stocks Covered

| Symbol | Company |
|---|---|
| RELIANCE | Reliance Industries Ltd. |
| TCS | Tata Consultancy Services |
| HDFCBANK | HDFC Bank Ltd. |
| INFY | Infosys Ltd. |
| WIPRO | Wipro Ltd. |
| TATAMOTORS | Tata Motors Ltd. |
| BAJFINANCE | Bajaj Finance Ltd. |
| ADANIENT | Adani Enterprises Ltd. |

---

## ⚠️ Disclaimer

This project is for **educational and portfolio purposes only**.  
Data shown is **simulated** and does not represent actual market prices.  
This is **NOT** SEBI-registered investment advice.

---

## 👤 Author

**Om Ganesh Kawale**  
IT Student 

---

## 📄 License

MIT License — free to use and modify.
