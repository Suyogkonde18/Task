
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const axios = require('axios');

router.get('/initialize', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await Transaction.deleteMany(); 
        await Transaction.insertMany(transactions); 

        res.status(200).json({ message: 'Database initialized successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to initialize database' });
    }
});

router.get('/', async (req, res) => {
    const { page = 1, perPage = 10, search = '' } = req.query;

    try {
        const query = {
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { price: { $regex: search } }
            ]
        };

        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        const totalCount = await Transaction.countDocuments(query);

        res.status(200).json({
            transactions,
            totalCount,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / perPage)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

router.get('/statistics/:month', async (req, res) => {
    const month = req.params.month;

    try {
        const startDate = new Date(`2021-${month}-01`);
        const endDate = new Date(`2021-${month}-31`);

        const totalSales = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate }, sold: true } },
            { $group: { _id: null, totalAmount: { $sum: '$price' }, totalSoldItems: { $sum: 1 } } }
        ]);

        const totalNotSoldItems = await Transaction.countDocuments({
            dateOfSale: { $gte: startDate, $lte: endDate },
            sold: false
        });

        res.status(200).json({
            totalSalesAmount: totalSales[0]?.totalAmount || 0,
            totalSoldItems: totalSales[0]?.totalSoldItems || 0,
            totalNotSoldItems
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Get bar chart data for 
router.get('/bar-chart/:month', async (req, res) => {
    const month = req.params.month;

    try {
        const startDate = new Date(`2021-${month}-01`);
        const endDate = new Date(`2021-${month}-31`);

        const priceRanges = [
            { minPrice: 0, maxPrice: 100 },
            { minPrice: 101, maxPrice: 200 },
            { minPrice: 201, maxPrice: 300 },
            { minPrice: 301, maxPrice: 400 },
            { minPrice: 401, maxPrice: 500 },
            { minPrice: 501, maxPrice: 600 },
            { minPrice: 601, maxPrice: 700 },
            { minPrice: 701, maxPrice: 800 },
            { minPrice: 801, maxPrice: 900 },
            { minPrice: 901, maxPrice: Infinity }
        ];

        const results = await Promise.all(priceRanges.map(async range => {
            return {
                range:`${range.minPrice} - ${range.maxPrice}`,
                count:
                    await Transaction.countDocuments({
                        price:
                            {$gte : range.minPrice ,$lte : range.maxPrice},
                        dateOfSale:
                            {$gte:startDate,$lte:endDate}
                    })
            };
        }));

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error:'Failed to fetch bar chart data' });
    }
});

router.get('/pie-chart/:month', async (req, res) => {
    const month = req.params.month;

    try {
        const startDate = new Date(`2021-${month}-01`);
        const endDate = new Date(`2021-${month}-31`);

        const results = await Transaction.aggregate([
            {$match:{dateOfSale:{ $gte:startDate,$lte:endDate}}},
            {$group:{_id:'$category', count:{ $sum :1 }}}
        ]);

         res.status(200).json(results);
     } catch (error) {
         res.status(500).json({ error:'Failed to fetch pie chart data' });
     }
});

module.exports = router;
