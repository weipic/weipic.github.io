# 私密相簿 Worker 部署與管理

私密相簿的密碼、R2 路徑與照片清單只保存在本機忽略檔與 Cloudflare KV。公開網站不再包含這些資料，R2 也應關閉 `r2.dev` 公開存取。

Worker 使用 Cloudflare Images binding 直接處理私有 R2 位元流：照片牆輸出 800px WebP、燈箱輸出 1600px WebP，單張下載與 ZIP 維持原始檔。Images 轉換失敗或來源超過支援限制時會自動回退原始檔。

## 第一次部署

1. 確認 [wrangler.jsonc](wrangler.jsonc) 的 `bucket_name` 與 Cloudflare R2 實際 bucket 名稱一致。
2. 在此資料夾安裝工具並登入：

   ```bash
   npm install
   npx wrangler login
   ```

3. 本專案已產生以下不會被 Git 追蹤的私密檔案，請勿貼到聊天、Issue 或 commit：

   - `gallery-config.private.json`：相簿、R2 prefix、照片清單與新密碼
   - `new-passwords.private.txt`：要交給客戶的新密碼
   - `.dev.vars`：密碼 pepper 與權杖簽章金鑰

4. 建立 KV 匯入檔並第一次部署（第一次部署會建立 KV namespace）：

   ```bash
   npm run build:config
   npx wrangler deploy
   ```

5. 上傳 Worker secrets 與相簿 KV：

   ```bash
   npx wrangler secret bulk .dev.vars
   npx wrangler kv bulk put .generated/gallery-kv.json --binding GALLERY_CONFIG --remote
   npx wrangler deploy
   ```

6. 確認服務：

   ```bash
   curl https://weipic-api.weipic2023.workers.dev/health
   ```

   再從網站輸入 `new-passwords.private.txt` 內的新密碼，確認照片牆與燈箱使用 WebP、單張下載與 ZIP 仍為原始檔。

7. Worker 驗證正常後，到 Cloudflare Dashboard → R2 → 該 bucket → Settings → Public access，停用 `r2.dev` 公開網址。最後再部署或推送前端網站。

> 部署新 Worker 後舊密碼會立即失效。請先準備好通知客戶的新密碼。

## 新增或修改相簿

編輯 `gallery-config.private.json`，每個相簿格式如下：

```json
{
  "id": "client-project-id",
  "password": "自訂密碼，不可空白且每個相簿不同",
  "clientName": "客戶名稱",
  "albumTitle": "顯示標題",
  "pageTitle": "頁面標題",
  "zipFilename": "下載檔名",
  "deliveryDate": "2026.08.10",
  "expiryDays": 14,
  "isDeleted": false,
  "prefix": "R2資料夾/",
  "photos": ["001.jpg", "002.jpg"]
}
```

更新後執行：

```bash
npm run check:config
npm run sync:config
```

`check:config` 只比較本機設定與線上 KV，不會修改線上資料。`sync:config` 會上傳目前設定，並刪除線上存在、但 `gallery-config.private.json` 已不存在的舊相簿 ID 與舊密碼索引；因此更名後的舊網址及舊密碼會一併失效。同步只管理 `gallery:` 與 `password-index:` 前綴，不會刪除 namespace 內其他用途的 key。

若只改相簿資料，不需要重新 deploy Worker 程式。若要下架但保留檔案，可將 `isDeleted` 改成 `true` 後重新匯入 KV；若直接刪除 R2 資料夾，Worker 也會檢查代表性物件並回傳「已過下載期限或已被下架」。

## 備份與金鑰輪替

- 把三個私密檔案備份到密碼管理器或加密磁碟，不要放進 Git。
- 遺失 `PASSWORD_PEPPER` 後，既有密碼摘要無法驗證；需重新產生 KV。
- 更換 `TOKEN_SECRET` 會讓所有已發出的短效相簿權杖立即失效。
- 如需換新客戶密碼，修改私密 JSON 後重新 `build:config` 與 KV 匯入即可。

## 本機檢查

在專案根目錄執行：

```bash
npm install
npm run check
```

此檢查會重建 Tailwind CSS，確認所有本機資源存在，並阻止公開 R2 網址、前端硬編碼密碼與舊 CDN 依賴被再次提交。
