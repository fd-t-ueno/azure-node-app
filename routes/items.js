const express = require('express');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const { getContainer } = require('../db');

const router = express.Router();
const itemsContainer = getContainer(process.env.COSMOS_ITEMS_CONTAINER_NAME); // items コンテナを取得

// 作成(認証必要)
// POST /items
router.post("/", auth, async (req, res) => {
    try {
        // リクエストボディを展開し、サーバー側でID/作成日時を付与して保存する
        const item = {
            id: crypto.randomUUID(),
            ...req.body,
            ownerId: req.user.userId,
            ownerName: req.user.username,
            createdAt: new Date().toISOString(),
        };

        // item を Cosmos DB に作成
        await itemsContainer.items.create(item);
        // 作成結果をそのまま返却
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create item" });
    }
});

// 一覧取得(認証必要)
// GET /items
router.get("/", auth, async (req, res) => {
    try {
        // `q` がある場合は name フィールド部分一致で絞り込み
        const q = req.query.q;

        // デフォルトは全件取得
        let query = "SELECT * FROM c";
        if (q) {
            // q が指定されているときのみ CONTAINS 条件を追加
            query = `SELECT * FROM c WHERE CONTAINS(c.name, "${q}")`;
        }

        // クエリを実行して結果配列(resources)を取得
        const { resources } = await itemsContainer.items.query(query).fetchAll();
        // 取得結果を JSON で返却
        res.json(resources);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch items" });
    }
});

// 単体削除(認証必要)
// DELETE /items/:id
router.delete("/:id", auth, async (req, res) => {
    try {
        // パスパラメータから削除対象IDを取得
        const id = req.params.id;

        // partitionKey = id の前提で対象itemを削除
        await itemsContainer.item(id, id).delete();

        // 削除完了レスポンス
        res.json({ message: "Item deleted", id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete item" });
    }
});

module.exports = router;
