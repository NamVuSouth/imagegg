import axios from 'axios';

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export default async function handler(req, res) {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query parameter q' });

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query, per_page: 12, client_id: process.env.UNSPLASH_ACCESS_KEY },
    });
    if (!response.data || !response.data.results) {
      return res.status(500).json({ error: 'Invalid response from Unsplash API' });
    }
    res.status(200).json(response.data);
  } catch (err) {
    console.error('Function error:', err.message);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
}




