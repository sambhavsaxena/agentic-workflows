import axios from "axios";
import { API_HOST, API_KEY, ENDPOINT } from "./constants.js";

const get_data_from_rapid_api = async (child_ref, query_params) => {
    const params = typeof query_params === 'string' ? JSON.parse(query_params) : query_params;
    const queryString = new URLSearchParams(params).toString();
    const url = `${ENDPOINT}/${child_ref}${queryString ? `?${queryString}` : ''}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': API_HOST,
        },
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result.data;
    } catch (error) {
        return { error: 'Error fetching stock data' };
    }
};

const get_stocks = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }
        const url = `https://groww.in/v1/api/search/v3/query/global/st_query?from=0&query=${encodeURIComponent(query)}&size=10`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json',
            },
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stocks', details: error.message });
    }
};

export { get_data_from_rapid_api, get_stocks }
