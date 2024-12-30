// src/components/TransactionsTable.js

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const TransactionsTable = ({ month }) => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const perPage = 10;

    // Use useCallback to memoize fetchTransactions
    const fetchTransactions = useCallback(async () => {
        try {
            const response = await axios.get(`/api/transactions?page=${page}&perPage=${perPage}&search=${search}`);
            setTransactions(response.data.transactions);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    }, [page, perPage, search]); // Add dependencies here

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]); // Include fetchTransactions as a dependency

    return (
        <div>
            <input 
                type="text" 
                placeholder="Search transactions..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
            />
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Date of Sale</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction._id}>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.price}</td>
                            <td>{transaction.category}</td>
                            <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => setPage(page > 1 ? page - 1 : page)}>Previous</button>
                <button onClick={() => setPage(page < Math.ceil(totalCount / perPage) ? page + 1 : page)}>Next</button>
            </div>
        </div>
    );
};

export default TransactionsTable;
