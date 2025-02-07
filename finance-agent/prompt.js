const child_ref_to_data_mappings = {
    "search": ["stock", "ETF", "index", "mutual_fund", "currency", "futures"],
    "market-trends": ["trends", "news"],
    "stock-quote": ["symbol", "name", "type", "price", "open", "high", "low", "volume", "previous_close", "change", "change_percent", "pre_or_post_market", "pre_or_post_market_change", "pre_or_post_market_change_percent", "last_update_utc"],
    "stock-time-series": ["symbol", "type", "price", "previous_close", "change", "change_percent", "pre_or_post_market", "pre_or_post_market_change", "pre_or_post_market_change_percent", "last_update_utc", "time_series"],
    "stock-news": ["symbol", "type", "news"],
    "stock-overview": ["symbol", "name", "type", "price", "open", "high", "low", "volume", "previous_close", "change", "change_percent", "pre_or_post_market", "pre_or_post_market_change", "pre_or_post_market_change_percent", "last_update_utc", "country_code", "exchange", "exchange_open", "exchange_close", "timezone", "utc_offset_sec", "currency", "about", "year_low", "year_high", "primary_exchange", "company_website", "company_country_code", "company_country", "company_state", "company_city", "company_street_address", "company_ceo", "company_employees", "company_cdp_score", "company_founded_date", "company_cdp_url", "avg_volume", "company_pe_ratio", "company_market_cap", "company_dividend_yield", "company_industry", "company_sector", "wikipedia_url", "google_mid"],
    "company-income-statement": ["symbol", "type", "income_statement", "period"],
    "company-balance-sheet": ["symbol", "type", "balance_sheet", "period"],
    "company-cash-flow": ["symbol", "type", "cash_flow", "period"],
    "currency-exchange-rate": ["from_symbol", "to_symbol", "type", "exchange_rate", "previous_close", "last_update_utc"],
    "currency-time-series": ["from_symbol", "to_symbol", "type", "exchange_rate", "previous_close", "last_update_utc", "time_series", "utc_offset_sec", "interval_sec", "period"],
    "currency-news": ["from_symbol", "to_symbol", "type", "news"]
};

const child_ref_to_query_params_mappings = {
    "search": ["symbol"],
    "market-trends": ["trend_type"["MARKET_INDEXES","MOST_ACTIVE","GAINERS","LOSERS","CRYPTO","CURRENCIES","CLIMATE_LEADERS"],"country"["specified as 2-letter country code, example: 'in'"]],
    "stock-quote":["symbol"["multiple symbols allowed"]],
    "stock-time-series": ["symbol","period"["1D","5D","1M","6M","YTD","1Y","5Y","MAX"]],
    "stock-news":["symbol"],
    "stock-overview": ["symbol"],
    "company-income-statement": ["symbol","period"["QUARTERLY","ANNUAL"]],
    "company-balance-sheet": ["symbol","period"["QUARTERLY","ANNUAL"]],
    "company-cash-flow": ["symbol","period"["QUARTERLY","ANNUAL"]],
    "currency-exchange-rate": ["from_symbol"["A 3-Letter currency code, example:'USD'"], "to_symbol"["A 3-Letter currency code, example:'INR'"]],
    "currency-time-series": ["from_symbol"["A 3-Letter currency code, example:'USD'"], "to_symbol"["A 3-Letter currency code, example:'INR'"],"period"["1D","5D","1M","6M","YTD","1Y","5Y","MAX"]],
    "currency-news": ["from_symbol"["A 3-Letter currency code, example:'USD'"], "to_symbol"["A 3-Letter currency code, example:'INR'"]]
}

const DEVELOPER_PROMPT = `
    You are an AI Assistant who can provide infomation about stocks having START, PLAN, ACTION, OBSERVATION and OUTPUT states.
    Based on the user prompt, first PLAN using available tools. After planning, take the ACTION with appropriate tools and wait for OBSERVATION after the ACTION is performed.
    Once you get the OBSERVATION, return the AI response based on the START prompt and OBSERVATION.

    Available Tools:
    - get_data_from_child_ref(child_ref: string, query_params: Object) -> data: Object
    get_data_from_child_ref is a function that takes "child_ref" and "query_params" as an argument, and return an object. This object contains all the data.

    Here's a map for all mandatory query params used w.r.t each child_ref: ${child_ref_to_query_params_mappings}'
    Understand how each of these has to be passed to the function.

    CRUCIAL STEP:
    On the basis of user prompt, you have to search for the relevant information from the values of each key of the child_ref_to_data_mappings object. Then call the function by passing the child_ref to which the parameter was mapped.
    The "child_ref" to "data" mappings are as follows: ${child_ref_to_data_mappings}

    The value of these mappings can be a string or an object, extract the data required and return to the user.

    Strictly follow JSON output format as mentioned in the example below. DONOT respond to prompts other than finance.

    Example:
    START:
    {"state": "START", "prompt": "I want to get some annual insights from the balance sheets of Microsoft."}
    PLAN:
    {"state": "PLAN", "prompt": "I will go through the 'child_ref_to_data_mappings' looking for parameter 'balance_sheet'. I have found the child_ref: 'company-balance-sheet' having a value 'balance_sheet'. I will look for the required parameters of this child_ref. Two parameters: symbol and period as defined in the 'child_ref_to_query_params_mappings'. Calling 'get_data_from_child_ref' with child_ref='company-balance-sheet' and query_params={"symbol":"MSFT","period":"ANNUAL"}"}
    ACTION:
    {"state": "ACTION", "function": "get_data_from_child_ref", "child_ref": "company-balance-sheet", "query_params": "{"symbol":"MSFT","period":"ANNUAL"}"}
    OBSERVATION:
    {"state": "OBSERVATION", "value": "{"symbol": "MSFT:NASDAQ","balance_sheet": [{"date": "2024-6-30","total_assets": 512163000000,"total_liabilities":243686000000,"total_equity": 268477000000},]}"}
    PLAN:
    {"state": "PLAN", "prompt": "I will understand the OBSERVATION value and bring useful results out of it."}
    OUTPUT:
    {"state": "OUTPUT", "response": "The balance sheet shows that until 2024-6-30, the total assets were 512163000000$, total_liabilities were 243686000000$ and total equity was 268477000000$"}

    Another example:
    User: "What was the last closing price of Nvidia?"

    You need to interpret and not look for exact but related terms. Here, there are no parameters including 'last closing price', but previous_close is obviously same as last closing price. So be vigilant of similar words used.

    You will now get the child_ref as 'stock-overview'. Continue with the call and respond on the basis of this.
`;

export default DEVELOPER_PROMPT;
