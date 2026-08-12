    const express = require('express');
    const router = express.Router();
    const Anthropic = require('@anthropic-ai/sdk');
    const authMiddleware = require('../middleware/auth');

    const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    });

    router.post('/scan', authMiddleware, async (req, res) => {
    try {
        const { imageBase64, mediaType } = req.body;

        if (!imageBase64 || !mediaType) {
        return res.status(400).json({ error: 'Image data is required' });
        }

        const response = await client.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        messages: [
            {
            role: 'user',
            content: [
                {
                type: 'image',
                source: {
                    type: 'base64',
                    media_type: mediaType,
                    data: imageBase64,
                },
                },
                {
                type: 'text',
                text: `You are a receipt scanner for a financial app. Analyze this receipt image and extract the following information. Respond ONLY with a JSON object, no extra text:
    {
    "storeName": "name of the store or business",
    "totalAmount": total amount as a number only (no currency symbols),
    "description": "brief description like Store Name - main items bought",
    "category": "one of: Food & Groceries, Transport, Airtime & Data, Rent & Bills, Health, Entertainment, Other Expense",
    "items": ["list", "of", "main", "items", "bought"],
    "date": "date on receipt in YYYY-MM-DD format or null if not found"
    }
    If you cannot read the receipt clearly, return:
    {"error": "Could not read receipt clearly. Please take a clearer photo."}`
                },
            ],
            },
        ],
        });

        const text = response.content[0].text;

        try {
        const clean = text.replace(/```json|```/g, '').trim();
        const data = JSON.parse(clean);

        if (data.error) {
            return res.status(400).json({ error: data.error });
        }

        res.json(data);
        } catch {
        res.status(500).json({ error: 'Could not parse receipt data. Please try again.' });
        }
    } catch (err) {
        console.error('Receipt scan error:', err.message);
        res.status(500).json({ error: 'Receipt scanning failed. Please try again.' });
    }
    });

    module.exports = router;