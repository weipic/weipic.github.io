# Wei's Portfolio

Wei 的個人攝影作品集網站，收錄商業、人像、演唱會、活動、運動、畢業與風景攝影作品，並提供預約聯絡、隱私權設定及具密碼保護的客戶交圖專區。

網站：[https://weipic.github.io/](https://weipic.github.io/)

## 主要功能

- 響應式攝影作品展示與全螢幕燈箱
- 七種攝影作品分類及合作、獎項資訊
- 預約與聯絡表單
- 繁體中文、英文及日文切換
- Cookie 同意管理與隱私權政策
- 私密客戶相簿、到期管理及密碼驗證
- 單張原圖、選取照片及 ZIP 批次下載
- Cloudflare R2 私有儲存與圖片預覽轉換

## 技術架構

公開網站以 HTML、JavaScript 與 Tailwind CSS 製作，透過 GitHub Pages 發布。客戶交圖頁會連線至獨立的 Cloudflare 私密相簿 API；密碼、照片清單及 R2 路徑不會寫入公開前端。

## 專案結構

```text
.
├── index.html                 # 首頁
├── commercial.html           # 商業攝影
├── portrait.html             # 人像攝影
├── concert.html              # 演唱會攝影
├── event.html                # 活動攝影
├── sports.html               # 運動攝影
├── graduation.html           # 畢業攝影
├── landscape.html            # 風景攝影
├── contact.html              # 預約與聯絡
├── privacy.html              # 隱私權政策
├── download.html             # 客戶交圖入口
├── css/                      # Tailwind 與自訂樣式
├── js/                       # 作品資料與前端互動
├── assets/images/            # 公開網站圖片
└── scripts/                  # 建置與安全稽核工具
```

## 本機開發

需求：Node.js、npm、Git 與 Python 3。

```bash
git clone https://github.com/weipic/weipic.github.io.git
cd weipic.github.io
npm install
npm run check
python3 -m http.server 8000
```

接著開啟 [http://localhost:8000/](http://localhost:8000/)。請使用本機 HTTP 伺服器預覽，不要直接開啟 HTML 檔案。

常用指令：

```bash
npm run build:css       # 重新產生 Tailwind CSS
npm run build:vendor    # 複製本機 JSZip 檔案
npm run audit           # 執行安全及資源完整性檢查
npm run check           # 重新建置 CSS 並執行稽核
```

## 發布

公開前端提交並推送至 `main` 後，由 GitHub Pages 發布。日常客戶相簿與 R2 照片管理請使用 [Cloudflare 雲端管理中心](https://weipic-api.weipic2023.workers.dev/admin)，不需由本專案部署。

發布前請至少執行：

```bash
npm run check
```

## 授權

網站程式碼與攝影作品之權利均由原作者保留。未經授權，請勿複製、轉載、修改或作商業使用。
