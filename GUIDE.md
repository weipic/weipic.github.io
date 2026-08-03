# 📸 攝影作品集網站 - 完整功能與維護指南 (Complete Feature & Maintenance Guide)

這份指南涵蓋了 **Wei's Portfolio** 攝影作品集網站的**所有功能機制、資料結構設定、燈箱與互動體驗、著作權保護、多國語言切換、線上預約表單、社群分享預覽**，以及如何將最新內容部署發布至 **GitHub Pages** 的標準作業流程。

---

## 📁 1. 檔案與專案目錄結構 (Project Structure)

本作品集採用**動態資料驅動 (Data-Driven)** 與 **前端 SPA 微架構** 打造，大部分內容（照片、個人簡介、合作紀錄、獲獎經歷）皆集中於 `js/portfolio-data.js` 進行維護。

```text
photography-portfolio/
├── js/
│   ├── portfolio-data.js    <-- 🌟 核心資料庫 (所有照片、內文、合作經歷、獲獎紀錄、個人簡介在此編輯)
│   └── app.js              <-- ⚡ 網站核心邏輯 (燈箱、多國語言、防盜圖、環境網址適應、表單串接)
├── css/
│   └── style.css            <-- 🎨 奢華視覺風格與動態效果 (Glassmorphism, 漸層, 閃爍光澤)
├── assets/
│   └── images/              <-- 📸 高解析度攝影照片存放目錄
│       ├── logo.svg         <-- 網站白色向量品牌 Logo (wei.pictures.svg)
│       ├── favicon.png      <-- 瀏覽器頁籤 Icon
│       ├── profile/         <-- 個人大頭照 (avatar.webp)
│       ├── commercial/      <-- 商業攝影照片 (.webp / .jpg)
│       ├── portrait/        <-- 人像寫真照片 (.webp / .jpg)
│       ├── concert/         <-- 演唱會紀實照片 (.webp / .jpg)
│       ├── event/           <-- 活動紀錄照片 (.webp / .jpg)
│       ├── sports/          <-- 運動賽事照片 (.webp / .jpg)
│       ├── graduation/      <-- 畢業寫真照片 (.webp / .jpg)
│       └── landscape/       <-- 風景視覺照片 (.webp / .jpg)
├── GUIDE.md                 <-- 📖 本完整指南文件
├── index.html               <-- 首頁 (關於我 + 合作經歷 + 獲獎紀錄 + 7 大作品分類門戶)
├── commercial.html          <-- 商業攝影專頁
├── portrait.html            <-- 人像攝影專頁
├── concert.html             <-- 演唱會攝影專頁
├── event.html               <-- 活動攝影專頁
├── sports.html              <-- 運動攝影專頁
├── graduation.html          <-- 畢業攝影專頁
├── landscape.html           <-- 風景攝影專頁
└── contact.html             <-- 預約與聯絡專頁 (FormSubmit 線上表單)
```

---

## 🌐 2. 網頁全站功能總覽 (Web Application Features)

本作品集具備以下現代化與高體驗特質：

| 功能模組 | 功能說明與實現機制 |
| :--- | :--- |
| **7 大攝影分類門戶** | 包含商業、人像、演唱會、活動、運動、畢業與風景 7 大題材，支援獨立專頁與動態 Switcher 導覽列。 |
| **頂部 Switcher 切換欄** | 於各分類頁面頂部提供水平滑動的類別切換頁籤，進入頁面時會自動平滑滾動並將當前類別置中。 |
| **沉浸式燈箱 Modal / 輪播** | 點擊作品卡片跳出大圖燈箱，支援左右切換 (`<` `>`)、鍵盤導覽 (`←` `→` `Esc`)、圖片計數器與縮圖滑動區。 |
| **外部相關連結按鈕** | 作品輯內可自訂多個外部按鈕（如 IG 貼文、官方網站、完整相簿），點擊可開啟指定網址。 |
| **焦點位置與放大倍率微調** | 支援 `position` (如 `top center`) 與 `scale` (如 `1.3`)，解決橫向矩形卡片貼齊圖片無上下挪移空間的問題。 |
| **合作經歷與獎項折疊** | 合作紀錄與獲獎經歷預設展示精選項目，具備底層漸層遮罩 (Gradient Mask) 與「顯示更多 / 收起」平滑滾動切換。 |
| **線上預約表單 (FormSubmit)** | 於 `contact.html` 提供表單串接 FormSubmit API，支援 AJAX 免轉頁送出、Loading Spinner 與 24 小時內回覆提示。 |
| **多國語言切換 (i18n)** | 整合 Google Translate API，支援繁體中文 (`zh-TW`)、英文 (`en`) 與日文 (`ja`)，設定值會自動記錄於 Cookie 及 `localStorage`。 |
| **行動裝置觸控優化** | 專為手機開發 `initMobileTouchHover` 觸控防誤觸機制，防止滾動頁面時觸發膠著 hover / active 狀態。 |
| **著作權與防盜圖保護** | 全站封鎖右鍵選單 (`contextmenu`)、禁止圖片拖曳 (`dragstart`)，並透過 `MutationObserver` 自動保護動態生成的燈箱圖片。 |
| **乾淨網址 (Clean URLs)** | `adaptLinksForEnvironment()` 於線上 Web Server 環境下自動移除網址中的 `.html` 後綴，升級質感與 SEO。 |
| **社群分享卡片 (Open Graph)** | 各 `.html` 頁面均設定獨立 OG 標籤與 Twitter Card，在 LINE、FB、iMessage、Discord 分享時顯示精美預覽卡片。 |

---

## 📸 3. 如何新增與編輯作品照片 (Add & Edit Works)

當您拍攝了新的作品，要將其新增至網站中，請遵循以下 **3 步驟**：

### 📌 步驟 1：放入照片檔案
將照片檔案（建議使用 WebP 格式以獲得最佳載入速度，亦支援 `.jpg` / `.png`）放進對應的 `assets/images/<category>/` 資料夾。
* 例如：新增人像作品 `portrait_5.webp` 放置於 `assets/images/portrait/`。

---

### 📌 步驟 2：修改 `js/portfolio-data.js`
打開 `js/portfolio-data.js`，找到 `galleries` 區塊中對應的分類（如 `portrait`），新增一個作品物件：

```javascript
galleries: {
  portrait: [
    // 🌟 新增作品項目：
    {
      id: "port-5",                                    // 1. 獨一無二的 ID (同分類下不可重複)
      title: "Summer Memories 夏日記憶",                // 2. 作品專案名稱
      client: "Personal Series",                        // 3. 客戶名稱 / 主題標籤
      year: "2026",                                    // 4. 拍攝年份
      cover: "assets/images/portrait/portrait_5.webp",// 5. 列表中顯示的封面圖片路徑
      position: "top center",                          // 6. 焦點位置 (見第 5 節說明)
      scale: 1.3,                                      // 7. 照片放大倍率 (見第 5 節說明)
      photos: [                                        // 8. 點開燈箱後的大圖輪播清單 (可放多張)
        "assets/images/portrait/portrait_5.webp",
        "assets/images/portrait/portrait_5_sub1.webp",
        "assets/images/portrait/portrait_5_sub2.webp"
      ],
      description: "在炎夏海邊拍攝的情緒寫真，記錄海風與光影的流動。", // 9. 作品故事詳細描述
      links: [                                         // 10. 🌟 (可選) 燈箱內的外部連結按鈕
        { label: "Instagram 貼文", url: "https://www.instagram.com/p/xxx" },
        { label: "觀看完整相簿", url: "https://example.com/album" }
      ]
    },

    // 原有的其他作品...
  ]
}
```

> [!IMPORTANT]
> **⚠️ 關鍵語法提醒（防止網頁黑屏）：**
> 在新增作品時，**前一個項目的右大括號 `}` 後面一定要加上逗號 `,`**！
> 漏掉逗號會導致 JavaScript 語法解析失敗，網頁呈現空白或黑屏。

#### 💡 屬性詳細欄位說明：
* **`id`**：作品唯一標識符（例如 `"port-5"`、`"comm-12"`、`"conc-8"`）。
* **`title`**：作品主標題。
* **`client`**：客戶名稱、主題標籤或拍攝類別（顯示於標題上方小字）。
* **`year`**：作品拍攝或發布年份。
* **`cover`**：作品卡片列印出的封面圖路徑。
* **`photos`**：點擊卡片彈出燈箱展示的所有圖片路徑陣列。可放 1 張或多張。
* **`description`**：作品內文故事與細節說明。
* **`links`**：（可選）外部連結按鈕陣列。每個物件包含：
  * `label`：按鈕顯示文字（如 `"Instagram 貼文"`、`"官方網站"`）。
  * `url`：點擊開啟的目標網址。

---

## 🖼️ 4. 7 大攝影分類與頂部 Switcher 切換欄設定 (Categories & Switcher)

網站共有 7 大攝影主題。若要更新分類的標題、英文名、簡介或門戶封面圖，請於 `js/portfolio-data.js` 的 `categories` 區塊進行編輯：

```javascript
categories: [
  {
    id: "portrait",
    title: "人像攝影",
    titleEn: "Portrait Photography",
    description: "個人寫真、時尚肖像、藝人形象與情緒氛圍，捕捉獨一無二的神韻。",
    cover: "assets/images/portrait/portrait_1.webp",
    pageUrl: "portrait.html",
    badge: "Portrait"
  },
  {
    id: "commercial",
    title: "商業攝影",
    titleEn: "Commercial Photography",
    description: "品牌包款、精品廣告、商品特寫與形象大片拍攝。",
    cover: "assets/images/commercial/commercial_1.webp",
    pageUrl: "commercial.html",
    badge: "Commercial"
  },
  // 包含 concert, event, sports, graduation, landscape...
]
```

### ⚡ 頂部 Switcher 切換欄 (Category Switcher Bar)
進入任何分類專頁（如 `portrait.html`）時，頂部會自動渲染動態切換列。
* 點擊任何類別即可切換專頁。
* 系統會自動計算位置，將當前 active 的類別**平滑滾動至螢幕正中央**（在手機版體驗極佳）。

---

## 🎯 5. 照片焦點定位與縮放微調機制 (Focal Position & Scale)

當作品卡片為橫向矩形（如 `h-80 sm:h-96`）時，橫向照片的上下邊緣預設會貼齊卡片。此時單獨設定上下移動會因為沒有多的高度空間而無法挪移。

作品集內建了 **`position` (焦點定位)** 與 **`scale` (縮放倍率)** 協同機制：

```javascript
{
  id: "port-1",
  title: "Golden Hour Urban Elegance",
  cover: "assets/images/portrait/portrait_1.webp",

  // 🌟 1. 焦點偏心位置 (CSS object-position 語法)：
  // - "top center"    (人物頭部偏上方時推薦 👈 最常用)
  // - "bottom center" (主體偏靠下方時使用)
  // - "center 20%"    (精確控制垂直 20% 位置)
  // - "center left" / "center right" (主體偏左或偏右)
  position: "top center",

  // 🌟 2. 照片放大倍率 (可選)：
  // 若填寫 position 但未填 scale，系統會預設自動放大 1.25 倍以產生挪移空間！
  // 您也可以手動自訂數值：
  // - scale: 1.35  (放大 1.35 倍，取得更多挪移空間)
  // - scale: 1.15  (輕微放大)
  scale: 1.3
}
```

---

## 🔍 6. 沉浸式燈箱 Modal 與輪播互動 (Lightbox Modal)

點擊任何作品卡片即會啟動高互動性大圖燈箱 Modal：

### 🌟 燈箱核心功能：
1. **多圖切換**：
   - 畫面左右設有圓形控制箭頭 (`<` `>`)。
   - 左下角設有圖片計數器（例如 `1 / 5`）。
2. **鍵盤快速鍵**：
   - 按 `Esc` 鍵：關閉燈箱 Modal。
   - 按 `←` 左箭頭：切換至上一張照片。
   - 按 `→` 右箭頭：切換至下一張照片。
3. **縮圖導覽區 (Thumbnails Bar)**：
   - 側邊欄（或手機版下方）提供本作品輯的所有照片縮圖。
   - 支援點擊快速跳轉，且列表可向下滑動預覽。
4. **手機版關閉按鈕保護**：
   - 右上角設有固定 `X` 關閉按鈕 (`z-50`)，帶有半透明背景與陰影，確保在任何手機螢幕尺寸或大圖比例下**絕不會被照片擋住**。
5. **自訂外部按鈕 (Custom Links)**：
   - 支援在作品欄位中設定 `links` 陣列，呈現黃金漸層 hover 效果之外連按鈕。

---

## ✍️ 7. 個人簡介、統計數據與技能標籤 (Profile & Stats)

打開 `js/portfolio-data.js` 找到 `profile` 區塊：

```javascript
profile: {
  name: "WEI",                                  // 品牌/英文姓名
  subTitle: "Freelance Photographer",           // 頭銜
  tagline: "EXPLORING LIGHT & STORIES",        // 大頭照上方小字標語
  avatar: "assets/images/profile/avatar.webp",  // 大頭照路徑
  location: "Taipei, Taiwan",                   // 居住/工作地點
  email: "weipic2023@gmail.com",
  instagram: "https://www.instagram.com/wei.pictures/",
  instagramHandle: "@wei.pictures",

  // 🌟 首頁關鍵數據統計 Grid
  stats: [
    { label: "IG粉絲數", value: "6000+" },
    { label: "攝影年資", value: "2+" },
    { label: "合作經歷", value: "20+" },
    { label: "攝影獎項", value: "7+" }
  ],

  // 🌟 個人簡介段落 (支援 HTML 超連結標籤)
  bio: [
    "我是Wei，18y，攝影資歷約兩年，仍在不斷嘗試各種題材，探索光影與故事。",
    "拍攝範圍涵蓋人像、風景、街拍、運動與紀實，持續記錄生活中的每個瞬間。",
    "歡迎追蹤與指教，各式拍攝合作需求歡迎來信聯繫或是填寫網頁預約表單！",
    '<a href="mailto:weipic2023@gmail.com">weipic2023@gmail.com</a>'
  ],

  // 技能專長標籤
  skills: ["商業攝影", "人像寫真", "演唱會紀實", "品牌活動紀錄", "運動攝影", "畢業寫真", "風景視覺"]
}
```

---

## 🤝 8. 品牌與活動合作經歷管理 (Collaborations)

找到 `js/portfolio-data.js` 的 `collaborations` 陣列：

```javascript
collaborations: [
  {
    id: "collab-22",
    brand: "CEWE",                             // 品牌或合作單位名稱
    role: "CEWE攝影大獎2027青年才華獎",          // 你的角色 / 專案名稱
    year: "2026-2027",                        // 合作年份
    category: "國際影展",                      // 類型標籤
    description: "官網封面照片｜商業合作",       // 簡短說明
    logoText: "CEWE"                          // 卡片上顯示的大字 Logo 標誌
  },
  // ... 其他合作項目
]
```

### ⚡ 折疊與漸層遮罩機制 (`toggleCollaborations`)
* 當合作經歷超過 3 項時，系統會自動在下方加上黑色淡出漸層遮罩 (`collab-gradient-overlay`)。
* 點擊「顯示更多經歷」按鈕會平滑展開所有項目；點擊「收起經歷」時會自動平滑滾動回合作經歷區塊頂部。

---

## 🏆 9. 攝影獎項與榮譽紀錄管理 (Awards)

找到 `js/portfolio-data.js` 的 `awards` 陣列：

```javascript
awards: [
  {
    id: "award-1",
    year: "2026",
    title: "TIFA Tokyo International Foto Awards", // 競賽名稱
    category: "Advertising / Beauty",              // 獲獎類別
    result: "Gold Winner (金獎)",                   // 獲獎名次 (顯示金黃色 Badge)
    description: "《Urban Elegance》作品榮獲東京國際攝影大獎金獎。"
  },
  // ... 其他獎項
]
```

### ⚡ 折疊與漸層遮罩機制 (`toggleAwards`)
* 當獎項超過 2 項時，系統會開啟折疊與底層遮罩。點擊可切換展開/收起，並支援平滑滾動。

---

## 📩 10. 線上預約與聯絡表單 (Contact Form)

於 `contact.html` 頁面提供完整的線上拍攝預約表單。

### 🌟 運作機制與技術細節：
1. ** FormSubmit API 無縫串接**：
   - 表單資料透過 `fetch()` AJAX 非同步發送至 `https://formsubmit.co/ajax/weipic2023@gmail.com`。
   - 顧客填寫完畢後**無需離開網頁**或跳轉至第三方頁面。
2. **防重複點擊與 Loading 狀態**：
   - 點擊送出後，按鈕會自動轉為禁用狀態 (`disabled`) 並顯示旋轉 Spinner。
3. **成功與失敗提示**：
   - **成功**：顯示綠色提示方塊「✅ 預約訊息已成功送出！將會於 24 小時內與您聯繫。」並自動清空表單。
   - **失敗**：顯示紅色警告並引導寄信至 `weipic2023@gmail.com`。

---

## 🌐 11. 多國語言切換功能 (Multi-Language / i18n)

頂部導覽列右側設有地球圖示選單，支援三語切換：
* 🇹🇼 **繁體中文** (`zh-TW`)
* 🇺🇸 **English** (`en`)
* 🇯🇵 **日本語** (`ja`)

### 🌟 實現原理：
* 整合 Google Translate 引擎。
* 當使用者點選語言時，`setLanguage(langCode)` 會將語言偏好寫入 `googtrans` Cookie 與 `localStorage` 的 `selected_lang` 鍵值，確保**重新整理或切換頁面時語言設定不丟失**。

---

## 📱 12. 行動裝置與 Touch 觸控優化 (Mobile & Touch Optimization)

1. **響應式漢堡選單 (`mobile-menu`)**：
   - 手機版導覽列提供直覺的漢堡選單，點擊可展開全站頁面導覽與語言切換按鈕。
2. **Touch 觸控防誤觸機制 (`initMobileTouchHover`)**：
   - 手機觸控螢幕滑動時，常會因為手指接觸而誤觸卡片的 `:hover` 懸浮效果。
   - `app.js` 內建觸控監聽器，精確分辨「手指滑動」與「點擊動作」，滑動時會自動清除 `.touch-active` 樣式，提供流暢原生 App 般的體驗。

---

## 🔒 13. 著作權與防盜圖保護機制 (Image Protection)

為了維護攝影師作品之著作權，全站 `app.js` 內建 3 重防護：

1. **封鎖右鍵選單 (`contextmenu`)**：
   - 於所有 `<img>`、`.image-hover-zoom` 與燈箱 Modal 區域攔截右鍵與長按選單。
2. **封鎖圖片拖曳 (`dragstart`)**：
   - 阻止使用者將圖片直接拖曳至桌面或新分頁儲存。全站 `img` 標籤自動加上 `draggable="false"`。
3. **動態 MutationObserver 保護**：
   - 自動監聽 DOM 樹變更，當點擊卡片跳出燈箱 Modal 產生的新圖片時，會**立即自動套用防拖曳保護**。

---

## 🔗 14. 乾淨網址與環境適應 (Clean URLs)

`app.js` 內建 `adaptLinksForEnvironment()` 函式：
* 於線上網頁伺服器（GitHub Pages / HTTP / HTTPS）環境下，透過 `history.replaceState` 自動消除網址結尾的 `.html`（如將 `portrait.html` 自動美化為 `portrait`）。
* 於本地雙擊開啟檔案 (`file://`) 環境下，維持原本 HTML 連結，確保**離線測試與線上發布 100% 完美相容**。

---

## 💬 15. 通訊軟體社群分享卡片設定 (Open Graph & Twitter Metadata)

當您把網站連結傳送至 **LINE、FB Messenger、iMessage、Instagram、Discord** 等聊天軟體時，軟體爬蟲會讀取 HTML `<head>` 內的 Open Graph 標籤。

### 📌 修改各頁面預覽標籤 (以 `index.html` 為例)：

```html
<head>
  <title>Wei's Portfolio - 關於我與合作經歷</title>
  <meta name="description" content="Wei's Portfolio 攝影作品集 - 商業攝影、人像寫真、演唱會紀實與品牌活動紀錄。">

  <!-- Open Graph (LINE / FB / Messenger / iMessage / Discord) -->
  <meta property="og:title" content="Wei's Portfolio - 關於我與合作經歷" />
  <meta property="og:description" content="Wei's Portfolio 攝影作品集 - 商業攝影、人像寫真、演唱會紀實與品牌活動紀錄。" />
  <meta property="og:image" content="https://weipic.github.io/assets/images/profile/avatar.png" />

  <!-- Twitter Card -->
  <meta name="twitter:title" content="Wei's Portfolio - 關於我與合作經歷" />
  <meta name="twitter:description" content="Wei's Portfolio 攝影作品集 - 商業攝影、人像寫真、演唱會紀實與品牌活動紀錄。" />
  <meta name="twitter:image" content="https://weipic.github.io/assets/images/profile/avatar.png" />
</head>
```

### 📋 全站頁面預覽圖片配置表：

| 頁面檔案 | 網址 | 預設分享圖片 (`og:image`) | 預設說明文字 (`og:description`) |
| :--- | :--- | :--- | :--- |
| **`index.html`** | `https://weipic.github.io/` | `profile/avatar.png` | 關於我、攝影資歷簡介、合作紀錄與 7 大作品分類總覽 |
| **`commercial.html`** | `https://weipic.github.io/commercial` | 商業第 1 輯封面 | Gaston Luga 品牌包款、精品廣告與商業形象拍攝 |
| **`portrait.html`** | `https://weipic.github.io/portrait` | 人像第 1 輯封面 | 棒球女孩 LOLO 日系主題寫真、個人寫真與人物紀錄 |
| **`concert.html`** | `https://weipic.github.io/concert` | 演唱會第 1 輯封面 | 喬山50週年慈善演唱會 (玖壹壹、A-Lin、周興哲等) |
| **`event.html`** | `https://weipic.github.io/event` | 活動第 1 輯封面 | 喬山50週年慈善演唱會主持紀實 (陳漢典、Lulu) |
| **`sports.html`** | `https://weipic.github.io/sports` | 運動第 1 輯封面 | LG TWINS X DRAGONS 聯名主題日賽事動態紀錄 |
| **`graduation.html`** | `https://weipic.github.io/graduation` | 畢業第 1 輯封面 | 校園寫真、畢業學士服紀錄與好友青春合照 |
| **`landscape.html`** | `https://weipic.github.io/landscape` | 風景第 1 輯封面 | 自然景觀、壯麗山川、城市夜景與光影紀實 |
| **`contact.html`** | `https://weipic.github.io/contact` | `profile/avatar.png` | 預約 Wei's Portfolio 攝影拍攝專案與聯絡管道 |

> 💡 **快取刷新提示**：若上傳新圖片後 LINE 或 FB 仍顯示舊預覽卡片，可使用 [LINE 預覽測試工具](https://poker.line.naver.jp/) 或 [Facebook 偵錯工具](https://developers.facebook.com/tools/debug/) 輸入網址並點選「重新擷取 (Fetch new information)」以清空快取。

---

## 🚀 16. 本地測試與部署至 GitHub Pages (Deploy & Troubleshooting)

### 📌 步驟 1：本地預覽測試 (Local Test)
在把檔案推送到 GitHub 前，可在 Terminal (終端機) 執行 Python 伺服器進行預覽：

```bash
python3 -m http.server 8080
```
開啟瀏覽器訪問 `http://localhost:8080` 即可預覽最新效果。

---

### 📌 步驟 2：推送上傳至 GitHub 發布 (Git Deploy)
確定預覽無誤後，輸入以下 3 行 Git 指令：

```bash
# 1. 暫存所有修改過的檔案與新上傳的照片
git add .

# 2. 建立提交紀錄 (說明本次更新內容)
git commit -m "更新作品集圖片、內文說明與合作紀錄"

# 3. 推送上傳至 GitHub (GitHub Pages 會於 1~2 分鐘內自動完成雲端發布)
git push
```

---

### 🛠️ 17. 數據載入失敗與語法除錯說明 (Troubleshooting)

若編輯 `js/portfolio-data.js` 後重新整理網頁發現黑屏或出現「⚠️ 資料讀取失敗」警告框：

1. **原因**：JavaScript 語法錯誤（最常見為物件之間**漏掉逗號 `,`** 或引號未成對）。
2. **除錯方法**：
   - 在瀏覽器按下 `F12` 或右鍵選擇「檢查 (Inspect)」。
   - 切換至 **Console (主控台)** 標籤頁。
   - Console 會明確標示錯誤發生的**檔案名稱與行號**（例如 `portfolio-data.js:89 Uncaught SyntaxError: Unexpected identifier`）。
   - 依照行號回到 `js/portfolio-data.js` 補上逗號 `,` 或修復引號即可恢復正常！
