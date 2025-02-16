import { API_HOST, API_KEY, ENDPOINT } from "./constants.js";

const get_data_from_child_ref = async (child_ref, query_params) => {
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

export default get_data_from_child_ref;
