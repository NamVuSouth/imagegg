import axios from 'axios';

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export default async function handler(req, res) {
    try {
        const query = req.query.q;
        const apiKey = process.env.UNSPLASH_API_KEY;

        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&client_id=${apiKey}`
        );

        const data = await response.json();

        return res.status(200).json({ results: data.results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}






