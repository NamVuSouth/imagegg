import express from "express";
import fetch from "node-fetch";
import { createServer } from "@vercel/node";

const app = express();

app.get("/api/search", async (req, res) => {
    const query = req.query.q;

    const apiKey = process.env.UNSPLASH_API_KEY;

    const result = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${apiKey}`
    );

    const data = await result.json();

    res.json(data);
});

// 👇 Export serverless handler
export default createServer(app);








