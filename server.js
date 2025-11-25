const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const TCG_API = 'https://api.pokemontcg.io/v2';

app.get('/api/cards', async (req, res) => {
    try {
        const { name, set, rarity, page = 1 } = req.query;
        let query = [];
        
        if (name) query.push(`name:"*${name}*"`);
        if (set) query.push(`set.name:"${set}"`);
        if (rarity) query.push(`rarity:"${rarity}"`);
        
        const response = await axios.get(`${TCG_API}/cards`, {
            params: {
                q: query.join(' ') || '',
                page: page,
                pageSize: 20,
                orderBy: '-set.releaseDate'
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('搜索错误:', error.message);
        res.status(500).json({ error: '查询失败' });
    }
});

app.get('/api/sets', async (req, res) => {
    try {
        const response = await axios.get(`${TCG_API}/sets`, {
            params: { orderBy: '-releaseDate' }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: '获取卡组失败' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`宝可梦TCG服务运行在端口 ${PORT}`);
});
