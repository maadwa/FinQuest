import streamlit as st
import yfinance as yf
import pandas as pd
import os
import numpy as np

# Set page layout
st.set_page_config(page_title="Stock Market Dashboard", layout="wide")

# Load ticker symbols from the CSV
@st.cache_data
def load_ticker_mapping(csv_path="nasdaq-listed.csv"):
    try:
        df = pd.read_csv(csv_path, encoding="utf-8")
        df.columns = df.columns.str.strip()
        if {"Symbol", "Security Name"}.issubset(df.columns):
            df = df[["Symbol", "Security Name"]].dropna()
            df["Display"] = df["Symbol"] + " - " + df["Security Name"]
            mapping = dict(zip(df["Display"], df["Symbol"]))
            return mapping
        else:
            st.warning(f"Required columns not found. Available: {df.columns.tolist()}")
    except Exception as e:
        st.error(f"Error loading ticker CSV: {e}")
    # Fallback if loading fails
    return {"AAPL - Apple Inc.": "AAPL", "MSFT - Microsoft Corp.": "MSFT"}

# Load ticker mapping
ticker_map = load_ticker_mapping()

# Sidebar: Searchable dropdown with ticker + name
st.sidebar.header("Select Stock and Time Period")
selected_display = st.sidebar.selectbox("Ticker Symbol", options=sorted(ticker_map.keys()))
ticker_symbol = ticker_map[selected_display]

# Time period selection
period = st.sidebar.selectbox("Time Period", options=["1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "max"], index=3)

# Fetch stock data from Yahoo Finance
ticker = yf.Ticker(ticker_symbol)
historical_data = ticker.history(period=period)
financials = ticker.financials
actions = ticker.actions

# Main Dashboard
st.title(f"📈 Stock Market Dashboard")
st.subheader(f"{selected_display}")

import datetime
import streamlit as st

# Get basic info from Yahoo Finance
info = ticker.info

# Live price data
current_price = info.get("regularMarketPrice", None)
previous_close = info.get("previousClose", None)
after_hours_price = info.get("postMarketPrice", None)
after_hours_change = None
after_hours_change_pct = None

if current_price and previous_close:
    change = current_price - previous_close
    change_pct = (change / previous_close) * 100
else:
    change, change_pct = None, None

if after_hours_price and current_price:
    after_hours_change = after_hours_price - current_price
    after_hours_change_pct = (after_hours_change / current_price) * 100

col1, col2 = st.columns([1, 2])

# Display the current price and company name
with col1:
    st.markdown(f"### {info.get('longName', ticker_symbol)}")
    st.markdown(f"#### {current_price:.2f} USD")

# Display change with color based on positive/negative value
with col2:
    if change is not None:
        change_color = "green" if change > 0 else "red"
        st.markdown(
            f"**<span style='color:{change_color}'>+{change:.2f} ({change_pct:.2f}%) today</span>**",
            unsafe_allow_html=True
        )
    
    # Display the formatted time
    current_time = datetime.datetime.now()
    formatted_time = current_time.strftime("%d %b, %I:%M %p").lstrip("0")  # lstrip to remove leading zero if exists
    st.caption(f"Closed: {formatted_time} • Disclaimer")

    # Display after-hours data with color
    if after_hours_price:
        after_hours_color = "green" if after_hours_change > 0 else "red"
        st.markdown(
            f"**<span style='color:{after_hours_color}'>After hours {after_hours_price:.2f} "
            f"{after_hours_change:+.2f} ({after_hours_change_pct:+.2f}%)</span>**",
            unsafe_allow_html=True
        )


# Ensure enough data exists for 52-week calculations
if not historical_data.empty and len(historical_data) >= 52:

    # 52-week high/low
    high_52w = historical_data['Close'].max()
    high_52w_date = historical_data['Close'].idxmax().strftime('%d-%b-%Y')

    low_52w = historical_data['Close'].min()
    low_52w_date = historical_data['Close'].idxmin().strftime('%d-%b-%Y')

    # Daily returns
    daily_returns = historical_data['Close'].pct_change().dropna()
    daily_volatility = daily_returns.std() * 100
    annual_volatility = daily_volatility * np.sqrt(252)

    # Bollinger Band style bands (using 20-day moving avg and std dev)
    ma20 = historical_data['Close'].rolling(window=20).mean()
    std20 = historical_data['Close'].rolling(window=20).std()

    upper_band = ma20.iloc[-1] + std20.iloc[-1]
    lower_band = ma20.iloc[-1] - std20.iloc[-1]

    # Price band % based on bands
    price_band_pct = ((upper_band - lower_band) / ma20.iloc[-1]) * 100 if ma20.iloc[-1] else None

    # Tick size (static or can be fetched from exchange rules)
    tick_size = 0.01

    # Create DataFrame
    price_info = {
        f"52 Week High ({high_52w_date})": high_52w,
        f"52 Week Low ({low_52w_date})": low_52w,
        "Upper Band": upper_band,
        "Lower Band": lower_band,
        "Price Band (%)": price_band_pct,
        "Daily Volatility": daily_volatility,
        "Annualised Volatility": annual_volatility,
        "Tick Size": tick_size
    }

    df_price_info = pd.DataFrame(list(price_info.items()), columns=["Metric", "Value"])
    df_price_info["Value"] = df_price_info["Value"].apply(
        lambda x: f"{x:.2f}%" if isinstance(x, float) and "%" in str(x) else f"{x:.2f}"
    )

    # Display it
    st.subheader("📊 Price Information (Calculated)")
    st.table(df_price_info)

else:
    st.warning("Not enough historical data to calculate price metrics.")

# Historical Market Data Table
st.subheader("Historical Market Data")
st.dataframe(historical_data)

# Line Chart of Closing Prices
st.subheader("Closing Price Over Time")
st.line_chart(historical_data['Close'])

# Bar Chart of Volume
st.subheader("Volume Traded")
st.bar_chart(historical_data['Volume'])

# Financial Data
st.subheader("Financials")
if not financials.empty:
    st.dataframe(financials)
else:
    st.write("No financials available.")

# Stock Actions
st.subheader("Stock Actions (Dividends and Splits)")
if not actions.empty:
    st.dataframe(actions)
else:
    st.write("No stock actions available.")

# Footer
st.markdown("---")
st.caption("Data provided by Yahoo Finance via yfinance")
