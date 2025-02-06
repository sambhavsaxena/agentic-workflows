## Understanding the Financial Data Agent: A Guide for Users (Testing Phase)

This document explains the types of financial questions you can ask the agent during this testing phase.  Please note that this is a limited test, and each user is restricted to a maximum of 10 messages.  Therefore, we encourage you to ask concise and focused questions to make the most of your interactions.

**What the Agent Can Do:**

The agent can access and process information related to various financial instruments and markets. It uses predefined data categories and parameters to understand your requests and fetch the relevant data.  Think of it as a structured query system, where you provide the key information, and the agent retrieves the corresponding details.

**Supported Data Categories and Sample Questions:**

The agent understands the following categories of financial data:

* **Search:** Search for different financial instruments (stocks, ETFs, indices, etc.).
    * _Example:_ "Find information on Tesla stock."
* **Market Trends:** Get information on market trends (e.g., top gainers, losers).
    * _Example:_ "What are the top performing stocks today?"  or "Show me the biggest losers in the Indian market." (Remember to specify the country code like "in" for India)
* **Stock Quote:** Retrieve real-time or recent stock quotes.
    * _Example:_ "What is the current price of Apple stock?" or "Get me the quote for MSFT and GOOG."
* **Stock Time Series:** Get historical stock price data.
    * _Example:_ "Show me the price history of Google for the past year." or "What was the price of Reliance stock 5 days ago?" (Remember to specify the time period like "1D", "5D", "1M", "1Y" etc.)
* **Stock News:** Fetch news related to specific stocks.
    * _Example:_ "What news is there about Amazon?"
* **Stock Overview:** Get a general overview of a stock, including key statistics.
    * _Example:_ "Tell me about Microsoft stock." or "What is the market capitalization of Infosys?"
* **Company Financial Statements:** Access company income statements, balance sheets, and cash flow statements.
    * _Example:_ "Show me the annual income statement for Berkshire Hathaway." or "What is the quarterly balance sheet for JP Morgan?" (Remember to specify the period as "QUARTERLY" or "ANNUAL")
* **Currency Exchange Rates:** Get current exchange rates between currencies.
    * _Example:_ "What is the exchange rate between USD and INR?"
* **Currency Time Series:** Retrieve historical currency exchange rate data.
    * _Example:_ "Show me the exchange rate history of EUR/GBP for the last month." (Remember to specify the time period like "1D", "5D", "1M", "1Y" etc.)
* **Currency News:** Find news related to specific currencies.
    * _Example:_ "Are there any news about the Japanese Yen?"

**Important Considerations:**

* **Keywords:** The agent relies on specific keywords to understand your requests.  Try to use terms related to the data categories listed above.  For example, use "quote," "price," "news," "overview," "financial statements," etc.
* **Parameters:** Many requests require specific parameters, such as stock symbols (e.g., AAPL, MSFT), currency codes (e.g., USD, INR), or time periods (e.g., 1D, 1M, 1Y).  Refer to the examples above to see how these parameters are used.
* **Ambiguity:** Be as specific as possible in your questions to avoid ambiguity. The more direct you are, the more likely the agent will understand your request.
* **Synonyms:** The agent is designed to understand some related terms. For instance, "last closing price" will be interpreted as "previous_close." However, it's always best to use the exact terms if you know them.
* **Testing Limitations:**  This is a testing phase. The agent's capabilities might be limited, and it may not understand all possible phrasing.  If you encounter issues, try rephrasing your question using the suggested keywords and parameters.
* **10-Message Limit:** Please be mindful of the 10-message limit per user during this testing phase.  Focus on the most important questions you have.

By following these guidelines, you can effectively interact with the agent and get the financial information you need during this testing period. Your feedback is valuable and will help us improve the agent's capabilities.
