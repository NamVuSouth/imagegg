const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

const ACCESS_KEY = '8-MO3XwkgvCcowGZRtBKPVJuE9PY9GRp2d792L7AJ_Q';

app.use(cors());
app.use(express.static('public'));

app.get('/search', async (req, res) => {
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

        res.json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
