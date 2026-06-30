const express = require('express');
const cors = require('cors');
const path = require('path');
const api = require('./base');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 1. Home
app.get('/api/home', async (req, res) => {
    const result = await api.home();
    res.status(result.status ? 200 : 500).json(result);
});

// 2. Search
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    
    if (!query) {
        return res.status(400).json({ status: false, message: 'Parameter query "q" wajib diisi' });
    }
    
    const result = await api.search(query, page);
    res.status(result.status ? 200 : 500).json(result);
});

// 3. Detail Komik
app.get('/api/detail', async (req, res) => {
    const url = req.query.url;
    
    if (!url) {
        return res.status(400).json({ status: false, message: 'Parameter query "url" wajib diisi' });
    }
    
    const result = await api.detail(url);
    res.status(result.status ? 200 : 500).json(result);
});

// 4. Chapter Images
app.get('/api/chapter', async (req, res) => {
    const url = req.query.url;
    
    if (!url) {
        return res.status(400).json({ status: false, message: 'Parameter query "url" wajib diisi' });
    }
    
    const result = await api.chapter(url);
    res.status(result.status ? 200 : 500).json(result);
});

// 5. List Semua Genre
app.get('/api/genres', async (req, res) => {
    const result = await api.genres();
    res.status(result.status ? 200 : 500).json(result);
});

// 6. Komik Berdasarkan Genre
app.get('/api/genres/:slug', async (req, res) => {
    const slug = req.params.slug;
    const page = parseInt(req.query.page) || 1;
    
    const result = await api.getByGenre(slug, page);
    res.status(result.status ? 200 : 500).json(result);
});

// 7. Filter Komik
app.get('/api/filter', async (req, res) => {
    const params = {
        genre: req.query.genre || '',
        status: req.query.status || '',
        type: req.query.type || '',
        order: req.query.order || '',
        page: parseInt(req.query.page) || 1
    };
    
    const result = await api.getFilter(params);
    res.status(result.status ? 200 : 500).json(result);
});

// Menjalankan server (lokal)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
}

// Export untuk Vercel Serverless
module.exports = app;
