# 私密相簿 Worker 與雲端管理中心

正式相簿資料保存在 Cloudflare KV，日常新增、修改、下架與刪除都使用 Worker 內建管理中心。公開網站不包含相簿設定或密碼，R2 也應關閉 `r2.dev` 公開存取。

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

5. 上傳 Worker secrets、設定管理密碼與相簿 KV：

   ```bash
   npx wrangler secret bulk .dev.vars
   npx wrangler secret put ADMIN_PASSWORD
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

## 日常雲端管理

開啟：

```text
https://weipic-api.weipic2023.workers.dev/admin
```

登入後可以：

- 新增、修改、搜尋、下架或刪除相簿下載資訊。
- 自動產生客戶密碼；明碼只顯示一次，KV 只保存加上 pepper 的摘要。
- 輸入 R2 資料夾後自動讀取照片檔名，不必手動整理 JSON。
- 複製客戶下載網址及查看修改／刪除前的最近備份。
- 從右上角「修改密碼」更換管理密碼，不需要 Wrangler 或重新部署。
- 檢視 R2 儲存大小、物件數量及本月 A／B 類作業統計。
- 從手機或電腦直接多選照片上傳到私有 R2；超過 50 MiB 的單檔自動使用 8 MiB 多段上傳。
- 依交件日期（預設最新優先）或相簿名稱 A–Z 排序。
- 刪除相簿資訊時保留 R2 原始照片，避免誤刪攝影原檔。

管理登入使用獨立的 Worker secret `ADMIN_PASSWORD` 作為初始／復原密碼、限速登入、8 小時 HttpOnly/SameSite 工作階段，以及同源請求檢查。第一次從管理頁修改後，只在 KV 的 `admin:password-digest` 保存加上 pepper 的摘要，初始 secret 不再能登入；已登入裝置最長會在原本的 8 小時工作階段結束後登出。請把新管理密碼保存到密碼管理器，不要放進 Git 或傳給客戶。

若忘記修改後的管理密碼，可從 Cloudflare KV 刪除 `admin:password-digest`，管理頁便會恢復使用 Worker secret `ADMIN_PASSWORD`；登入後應立即設定新密碼。

KV 是最終資料來源，變更通常很快可見，但全球邊緣快取可能需要約 60 秒或更久才完全更新。

### R2 統計與上傳

R2 容量及物件數由 Worker 的私有 R2 binding 直接掃描，每 5 分鐘快取一次。按「更新統計」可以強制重新計算；掃描本身會產生 R2 `ListObjects` A 類作業。

A／B 類作業使用 Cloudflare 與 Dashboard 相同的 GraphQL Analytics 資料。第一次按「連接 A／B 統計」時：

1. 從畫面連結建立自訂 API Token。
2. 權限只選 `Account → Account Analytics → Read`，不要加入任何寫入權限。
3. 將只顯示一次的 token 貼回管理頁，按「驗證並連接」。

Token 驗證成功後會使用由 `TOKEN_SECRET` 衍生的 AES-GCM 金鑰加密，僅將密文保存在 KV；管理 API 不提供讀回明碼的功能。若更換 `TOKEN_SECRET`，需重新連接 Analytics。

「上傳照片到 R2」支援多檔選取、每檔進度、同名檔案防覆蓋，以及選擇性允許覆蓋。上傳成功後，再於新增／編輯相簿中輸入同一 R2 資料夾並按「從 R2 讀取照片」，即可自動建立照片清單。

## 舊本機設定與災難復原

舊的 `gallery-config.private.json` 僅保留作為離線備份，不再用於日常同步。`npm run check:config` 與 `npm run sync:config` 已安全停用，以免過期的本機檔案覆蓋雲端新增資料。

只有在雲端資料遺失並確認要以本機備份完整覆蓋時，才可人工執行：

```bash
npm run build:config
node scripts/sync-gallery-kv.mjs --apply --confirm-local-authority
```

這個復原動作會刪除本機設定中不存在的線上 `gallery:` 與 `password-index:` keys，執行前必須先確認 Cloudflare 帳號與備份內容。

## 舊版相簿資料格式（僅供復原參考）

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

若只透過管理中心改相簿資料，不需要重新 deploy Worker 程式。若直接刪除 R2 資料夾，Worker 也會檢查代表性物件並回傳「已過下載期限或已被下架」。

## 備份與金鑰輪替

- 把舊版私密檔案與管理密碼備份到密碼管理器或加密磁碟，不要放進 Git。
- 遺失 `PASSWORD_PEPPER` 後，既有密碼摘要無法驗證；需重新產生 KV。
- 更換 `TOKEN_SECRET` 會讓所有已發出的短效相簿權杖立即失效。
- 如需換新客戶密碼，在管理中心編輯相簿並輸入新密碼；舊密碼索引會自動失效。

## 本機檢查

在專案根目錄執行：

```bash
npm install
npm run check
```

此檢查會重建 Tailwind CSS，確認所有本機資源存在，並阻止公開 R2 網址、前端硬編碼密碼與舊 CDN 依賴被再次提交。
