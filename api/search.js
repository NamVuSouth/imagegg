import axios from "axios";

export default async function handler(req, res) {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Missing query parameter q' });

    try {
        const response = await axios.get("https://api.unsplash.com/search/photos", {
            params: {
                query,
                per_page: 12,
                client_id: process.env.UNSPLASH_ACCESS_KEY
            }
        });

        return res.status(200).json(response.data);
    } catch (err) {
        console.error("API error:", err.message);
        return res.status(500).json({ error: "Failed to fetch images" });
    }
}
