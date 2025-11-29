const axios = require('axios');

const ACCESS_KEY = '8-MO3XwkgvCcowGZRtBKPVJuE9PY9GRp2d792L7AJ_Q';

export default async function handler(req, res) {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Missing query parameter q' });
    }

    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query,
                per_page: 12,
                client_id: ACCESS_KEY,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
}
