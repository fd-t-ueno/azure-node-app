const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getContainer } = require('../db');
require('dotenv').config();

const router = express.Router();
const usersContainer = getContainer('users'); // ユーザー情報を格納するコンテナ

// ユーザー登録
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if( !username || !password ) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // username 重複チェック(パラメータ化クエリ)
        const querySpec = {
            query: "SELECT * FROM c WHERE c.username = @username",
            parameters: [
                { name: "@username", value: username }
            ]
        };

        const { resources: existingUsers } = await usersContainer.items.query(querySpec).fetchAll();

        if(existingUsers.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // パスワードをハッシュ化
        const passwordHash = await bcrypt.hash(password, 10);

        const user = {
            id: crypto.randomUUID(),
            username,
            passwordHash,
            role: role || 'user', // デフォルトは 'user'
            createdAt: new Date().toISOString(),
        }

        await usersContainer.items.create(user);

        // passwrordHash は返却しない
        return res.status(201).json({
            id: user.id,
            username: user.username,
            role: user.role,
            createdAt: user.createdAt
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'register failed' });
    }
});

// ユーザーログイン
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if( !username || !password ) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const querySpec = {
            query: "SELECT * FROM c WHERE c.username = @username",
            parameters: [
                { name: "@username", value: username }
            ]
        };

        const { resources: users } = await usersContainer.items.query(querySpec).fetchAll();

        if(users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if(!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'login failed' });
    }
});

module.exports = router;
