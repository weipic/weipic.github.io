/**
 * ====================================================================
 * 📸 攝影作品集資料設定檔 (PORTFOLIO DATA CONFIG)
 * ====================================================================
 */

window.PORTFOLIO_DATA = {
  // ------------------------------------------------------------------
  // 1. 個人簡介與關於我 (About Me)
  // ------------------------------------------------------------------
  profile: {
    name: "WEI",
    subTitle: "Freelance Photographer",
    tagline: "",
    avatar: "assets/images/profile/avatar.webp",
    location: "Taipei, Taiwan",
    email: "weipic2023@gmail.com",
    instagram: "https://www.instagram.com/wei.pictures/",
    instagramHandle: "@wei.pictures",
    experienceYears: "2+",
    stats: [
      { label: "IG粉絲數", value: "6500+" },
      { label: "攝影年資", value: "2+" },
      { label: "合作經歷", value: "20+" },
      { label: "攝影獎項", value: "7+" }
    ],
    bio: [
      "我是Wei，18y，攝影資歷約兩年，仍在不斷嘗試各種題材，探索光影與故事。",
      "拍攝範圍涵蓋人像、風景、街拍、運動與紀實，持續記錄生活中的每個瞬間。",
      "歡迎追蹤與指教，各式拍攝合作需求歡迎來信聯繫或是填寫網頁預約表單！",
      '<a href="mailto:weipic2023@gmail.com">weipic2023@gmail.com</a>'
    ],
    skills: ["商業攝影", "人像寫真", "演唱會紀實", "品牌活動紀錄", "運動攝影", "畢業寫真", "風景視覺"]
  },

  // ------------------------------------------------------------------
  // 2. 合作經歷與品牌 clients (Collaborations & Experience)
  // 點擊後會以「照片集燈箱 Modal」顯示。
  // 專屬照片可放於 assets/images/collaboration/ 資料夾中，並在 photos: [...] 填寫路徑
  // ------------------------------------------------------------------
  collaborations: [
    {
    "id": "collab-23",
    "brand": "CEWE",
    "role": "CEWE攝影大獎2027青年才華獎",
    "year": "2026-2027",
    "category": "國際影展",
    "description": "官網封面照片｜商業合作",
    "logoText": "CEWE",
    photos: [             
      "assets/images/collaboration/cewe.webp",
    ],
    links: [              
      { label: "CEWE Photo Award", url: "https://contest.cewe.co.uk/cewephotoaward2027/en_gb/youngtalentaward" }
    ]
    },
    {
    "id": "collab-22",
    "brand": "Gogoro",
    "role": "2026 年度車主活動《快閃太空城》",
    "year": "2026",
    "category": "品牌合作",
    "description": "KOC 社群宣傳與專屬優惠推廣 ｜ 商業合作",
    "logoText": "Gogoro",
    photos: [             
      "assets/images/collaboration/gogoro_story.webp",
    ],
    links: [              
      { label: "Gogoro 2026 《百 GO 夜行》", url: "https://gogoro2026.oen.tw/events/3FD6X11DEssBRUmforgCWj1wVou" }
    ]
    },
    {
    "id": "collab-21",
    "brand": "TAMRON",
    "role": "25-200mm f/2.8-5.6 Di III VXD G2",
    "year": "2026",
    "category": "商業",
    "description": "鏡頭評測",
    "logoText": "TAMRON",
    galleryId: "comm-9"
    },
    {
    "id": "collab-20",
    "brand": "青攝獎",
    "role": "第13屆青攝獎全國大專盃",
    "year": "2026",
    "category": "競賽",
    "description": "學生評審 with 廖文瑄老師 @ontheay.today",
    "logoText": "青攝獎",
    photos: [             
      "assets/images/collaboration/ntutphotoclub.webp",
    ],
    },
    {
    "id": "collab-19",
    "brand": "SITCON",
    "role": "2026 學生計算機年會",
    "year": "2026",
    "category": "活動紀錄",
    "description": "中央研究院｜活動紀錄",
    "logoText": "SITCON",
    galleryId: "ev-5"
    },
    {
    "id": "collab-18",
    "brand": "閃動格子",
    "role": "臺北市2026高中職升學進路博覽會",
    "year": "2026",
    "category": "活動紀錄",
    "description": "閃動格子 CyberCube｜活動紀錄",
    "logoText": "CyberCube",
    galleryId: "ev-7"
    },
    {
    "id": "collab-17",
    "brand": "LiFUNd",
    "role": "LiFUNd 第三屆夢想啟航",
    "year": "2026",
    "category": "活動紀錄",
    "description": "社會創新實驗中心｜活動紀錄",
    "logoText": "LiFUNd",
    galleryId: "ev-4"
    },
    {
    "id": "collab-16",
    "brand": "Gaston Luga",
    "role": "Spläsh 2.0 - 16, Sage",
    "year": "2026",
    "category": "商業",
    "description": "品牌合作",
    "logoText": "Gaston Luga",
    "galleryId": "comm-2"
    },
    {
    "id": "collab-15",
    "brand": "Threads",
    "role": "第一屆美式畢業舞會暨春酒晚宴",
    "year": "2026",
    "category": "活動紀錄",
    "description": "2026 Threads' Party｜活動紀錄",
    "logoText": "Threads",
    galleryId: "ev-6"
    },
    {
    "id": "collab-14",
    "brand": "國立臺北科技大學",
    "role": "北科大114年校慶",
    "year": "2025",
    "category": "活動紀錄",
    "description": "表彰卓越貢獻傑出校友｜活動紀錄",
    "logoText": "國立臺北科技大學",
    galleryId: "ev-2"
    },
    {
    "id": "collab-13",
    "brand": "NTUT COLAZ",
    "role": "美式經典棒球外套",
    "year": "2025",
    "category": "商業",
    "description": "商業合作",
    "logoText": "NTUT COLAZ",
    galleryId: "comm-3"
    },
    {
    "id": "collab-12",
    "brand": "HOKKI",
    "role": "No. 3 香水",
    "year": "2025",
    "category": "商業",
    "description": "商業合作",
    "logoText": "HOKKI",
    galleryId: "comm-4"
    },
    {
    "id": "collab-11",
    "brand": "Gaston Luga",
    "role": "Spläsh Utility Backpack 16, Latte",
    "year": "2025",
    "category": "商業",
    "description": "品牌合作",
    "logoText": "Gaston Luga",
    "galleryId": "comm-1"
    },
    {
    "id": "collab-10",
    "brand": "大環藝術家楊世豪",
    "role": "「舞極Ｘ唯一」｜奇美博物館",
    "year": "2025",
    "category": "大型商演",
    "description": "攝影師",
    "logoText": "大環藝術家楊世豪",
    galleryId: "ev-8"
    },
    {
    "id": "collab-9",
    "brand": "TAMRON",
    "role": "20-40mm f/2.8 Di III VXD",
    "year": "2025",
    "category": "商業",
    "description": "鏡頭評測",
    "logoText": "TAMRON",
    galleryId: "comm-8"
    },
    {
    "id": "collab-8",
    "brand": "美若康隱形眼鏡",
    "role": "商業廣告授權",
    "year": "2025",
    "category": "商業",
    "description": "棒球女孩LOLO-美若康矽水膠隱形眼鏡中職明星賽抽獎活動視覺授權",
    "logoText": "美若康隱形眼鏡",
    galleryId: "comm-5"
    },
    {
    "id": "collab-7",
    "brand": "MAHIRU",
    "role": "2025  茉ひる ASIA TOUR 『SeRendipity』in TAIPEI",
    "year": "2025",
    "category": "演唱會",
    "description": "日本人氣歌手茉ひる亞洲巡演台北站-攝影師",
    "logoText": "MAHIRU",
    galleryId: "conc-6"
    },
    {
    "id": "collab-6",
    "brand": "國立臺北科技大學Aliyan原住民文化研究社",
    "role": "《Patikol 洄巢－Torik部落創作樂舞劇場》",
    "year": "2025",
    "category": "活動紀錄",
    "description": "活動紀錄",
    "logoText": "NTUT Aliyan",
    galleryId: "ev-11"
    },
    {
    "id": "collab-5",
    "brand": "PNGL",
    "role": "LIGHTZIP 27-32L 秒收捲捲包",
    "year": "2025",
    "category": "商業",
    "description": "品牌合作",
    "logoText": "PNGL",
    galleryId: "comm-7"
    },
    {
    "id": "collab-4",
    "brand": "ACMEITEM",
    "role": "棒球女孩LOLO-輕量連帽防潑水外套",
    "year": "2025",
    "category": "商業",
    "description": "委託合作",
    "logoText": "ACMEITEM",
    galleryId: "comm-6"
    },
    {
    "id": "collab-3",
    "brand": "KASE",
    "role": "CPL III 偏光鏡評測",
    "year": "2025",
    "category": "商業",
    "description": "器材評測",
    "logoText": "KASE"
    },
    {
    "id": "collab-2",
    "brand": "PENTAX",
    "role": "Pentax 17 底片相機",
    "year": "2024",
    "category": "商業",
    "description": "器材評測",
    "logoText": "PENTAX",
    galleryId: "comm-10"
    },
    {
    "id": "collab-1",
    "brand": "Gaston Luga",
    "role": "GL X Nikon 聯名款背包",
    "year": "2024",
    "category": "商業",
    "description": "品牌合作",
    "logoText": "Gaston Luga"
    }
  ],

  // ------------------------------------------------------------------
  // 3. 獲獎紀錄與榮譽 (Awards & Honors)
  // 點擊後會以「照片集燈箱 Modal」顯示。
  // 專屬照片或證書可放於 assets/images/award/ 資料夾中，並在 photos: [...] 填寫路徑
  // ------------------------------------------------------------------
  awards: [
    {
    "id"          : "award-7",
    "year"        : "2025",
    "title"       : "國家地理雜誌臺灣攝影大賽",
    "category"    : "青少年組",
    "result"      : "入圍",
    "description" : "入圍 2025 國家地理雜誌臺灣攝影大賽青少年組",
    photos: [             
      "assets/images/award/國家地理台灣青年入圍.webp",
    ],
    links: [              
      { label: "Instagram 貼文", url: "https://www.instagram.com/p/DNqclZphgC4/" }
    ]
    },
    {
    "id"          : "award-6",
    "year"        : "2025",
    "title"       : "全國學生攝影比賽",
    "category"    : "學生競賽",
    "result"      : "銅獎",
    "description" : "榮獲 2025 全國學生攝影比賽銅獎",
    photos: [             
      "assets/images/award/全國學生攝影銅獎 (1).webp",
      "assets/images/award/全國學生攝影銅獎 (2).webp",
      "assets/images/award/全國學生攝影銅獎 (3).webp",
      "assets/images/award/全國學生攝影銅獎 (4).webp",
      "assets/images/award/全國學生攝影銅獎 (5).webp",
    ],
    links: [              
      { label: "Instagram 貼文", url: "https://www.instagram.com/p/DJ-_kXTJV9s/?img_index=1" }
    ]
    },
    {
    "id"          : "award-5",
    "year"        : "2025",
    "title"       : "全國學生攝影比賽",
    "category"    : "學生競賽",
    "result"      : "特別獎",
    "description" : "榮獲 2025 全國學生攝影比賽特別獎",
    photos: [             
      "assets/images/award/全國學生攝影特別獎 (1).webp",
      "assets/images/award/全國學生攝影特別獎 (2).webp",
      "assets/images/award/全國學生攝影特別獎 (3).webp",
      "assets/images/award/全國學生攝影特別獎 (4).webp",
      "assets/images/award/全國學生攝影特別獎 (5).webp",
    ],
    links: [              
      { label: "Instagram 貼文", url: "https://www.instagram.com/p/DJtfuj9hZH6/?img_index=1" }
    ]
    },
    {
    "id"          : "award-4",
    "year"        : "2025",
    "title"       : "Canon Taiwan 6th 校園大使",
    "category"    : "校園大使",
    "result"      : "決選入選",
    "description" : "入選 Canon Taiwan 第 6 屆校園攝影大使決選名單"
    },
    {
    "id"          : "award-3",
    "year"        : "2025",
    "title"       : "青攝獎全國大專盃",
    "category"    : "大專競賽",
    "result"      : "入圍",
    "description" : "入圍 2025 第 12 屆青攝獎全國大專盃"
    },
    {
    "id"          : "award-2",
    "year"        : "2025",
    "title"       : "日本高中生攝影大賽",
    "category"    : "單張照片部門",
    "result"      : "入選",
    "description" : "榮獲第 12 屆日本高中生攝影大賽單張照片部門入選"
    },
    {
    "id"          : "award-1",
    "year"        : "2024",
    "title"       : "日本高中生攝影大賽",
    "category"    : "單張照片部門",
    "result"      : "入選",
    "description" : "榮獲第 11 屆日本高中生攝影大賽單張照片部門入選"
    }
  ],

  // ------------------------------------------------------------------
  // 4. 攝影類型類別目錄 (7 大分類)
  // ------------------------------------------------------------------
  categories: [
    {
    id: "commercial",
    title: "商業攝影",
    titleEn: "Commercial Photography",
    description: "產品拍攝與品牌形象，突顯品牌質感",
    cover: "assets/images/commercial/Gastonluga2 (2).webp",
    pageUrl: "commercial.html",
    badge: "Commercial"
    },
    {
    id: "portrait",
    title: "人像攝影",
    titleEn: "Portrait Photography",
    description: "個人寫真與形象照，捕捉個人氣質",
    cover: "assets/images/portrait/LOLO (7).webp",
    pageUrl: "portrait.html",
    badge: "Portrait",
    position: "bottom center",
    scale: 1.1
    },
    {
    id: "concert",
    title: "演唱會攝影",
    titleEn: "Concert Photography",
    description: "捕捉舞台燈光、表演者爆發力與現場氛圍",
    cover: "assets/images/concert/911 (1).webp",
    pageUrl: "concert.html",
    badge: "Concert",
    position: "bottom center",
    scale: 1.3
    },
    {
    id: "event",
    title: "活動攝影",
    titleEn: "Event Photography",
    description: "活動、發表會與企業年會，紀錄重要時刻",
    cover: "assets/images/event/Lulu (1).webp",
    pageUrl: "event.html",
    badge: "Event"
    },
    {
    id: "sports",
    title: "運動攝影",
    titleEn: "Sports Photography",
    description: "高速快門定格賽事動態，呈現速度與力量感",
    cover: "assets/images/sports/WDragons0526 (1).webp",
    pageUrl: "sports.html",
    badge: "Sports",
    position: "bottom center",
    scale: 1.2
    },
    {
    id: "graduation",
    title: "畢業攝影",
    titleEn: "Graduation Photography",
    description: "校園寫真、好友合照，留下青春紀實",
    cover: "assets/images/graduation/NYCU (6).webp",
    pageUrl: "graduation.html",
    badge: "Graduation"
    },
    {
    id: "landscape",
    title: "風景攝影",
    titleEn: "Landscape Photography",
    description: "自然大景、壯麗山川與城市",
    cover: "assets/images/landscape/landscape1.webp",
    pageUrl: "landscape.html",
    badge: "Landscape"
    }
  ],

  // ------------------------------------------------------------------
  // 5. 7大攝影作品集相簿 (支援 position 自訂偏心位置，例如 "top center", "center 25%")
  // ------------------------------------------------------------------
  galleries: {
    commercial: [
      {
        id: "comm-1",
        title: "Gaston Luga Spläsh Utility Backpack 16, Latte",
        client: "Gaston Luga",
        year: "2025",
        cover: "assets/images/commercial/Gastonluga2 (10).webp",
        position: "center 65%",
        links: [
        { label: "品牌官方網站", url: "https://gastonluga.com/tw" },
        { label: "Instagram 貼文", url: "https://www.instagram.com/p/DTDKdk0EnQE/?img_index=1" }
        ],
        photos: [
          "assets/images/commercial/Gastonluga2 (1).webp",
          "assets/images/commercial/Gastonluga2 (2).webp",
          "assets/images/commercial/Gastonluga2 (3).webp",
          "assets/images/commercial/Gastonluga2 (4).webp",
          "assets/images/commercial/Gastonluga2 (5).webp",
          "assets/images/commercial/Gastonluga2 (6).webp",
          "assets/images/commercial/Gastonluga2 (7).webp",
          "assets/images/commercial/Gastonluga2 (8).webp",
          "assets/images/commercial/Gastonluga2 (9).webp",
          "assets/images/commercial/Gastonluga2 (10).webp",
        ],
        description: "極簡俐落的北歐美學。融合自然奶茶色調與沉穩暗影，完美展示大容量收納與極致工藝細節。"
      },
      {
        id: "comm-2",
        title: "Gaston Luga Spläsh 2.0-16, Sage",
        client: "Gaston Luga",
        year: "2026",
        cover: "assets/images/commercial/Gastonluga3 (1).webp",
        position: "center center",
        links: [
        { label: "品牌官方網站", url: "https://gastonluga.com/tw" },
        { label: "Instagram 貼文", url: "https://www.instagram.com/p/DVF_g4PE7zV/?img_index=1" }
        ],
        photos: [
          "assets/images/commercial/Gastonluga3 (1).webp",
          "assets/images/commercial/Gastonluga3 (2).webp",
          "assets/images/commercial/Gastonluga3 (3).webp",
          "assets/images/commercial/Gastonluga3 (4).webp",
          "assets/images/commercial/Gastonluga3 (5).webp",
          "assets/images/commercial/Gastonluga3 (6).webp",
          "assets/images/commercial/Gastonluga3 (7).webp",
          "assets/images/commercial/Gastonluga3 (8).webp",
          "assets/images/commercial/Gastonluga3 (9).webp",
          "assets/images/commercial/Gastonluga3 (10).webp",
        ],
        description: "兼具機能與品味的都會包款。優雅的鼠尾草綠拼接霧黑飾帶，展現簡約、百搭且實用的日常工藝。"
      },
      {
        id: "comm-3",
        title: "NTUT Colaz 美式經典棒球外套",
        client: "Colaz",
        year: "2025",
        cover: "assets/images/commercial/NtutColaz (1).webp",
        position: "center 25%",
        links: [
        { label: "Instagram 貼文", url: "https://www.instagram.com/p/DRUP44EkvxO/?igsh=Z25xcWlmd2d2OXdo" }
        ],
        photos: [
          "assets/images/commercial/NtutColaz (1).webp",
          "assets/images/commercial/NtutColaz (2).webp",
          "assets/images/commercial/NtutColaz (3).webp",
          "assets/images/commercial/NtutColaz (4).webp",
          "assets/images/commercial/NtutColaz (5).webp",
          "assets/images/commercial/NtutColaz (6).webp",
          "assets/images/commercial/NtutColaz (7).webp",
          "assets/images/commercial/NtutColaz (8).webp",
        ],
        description: "北科棒球隊 × NTUT Colaz"
      },
      {
        id: "comm-4",
        title: "HOKKI No. 3 香水",
        client: "Hokki",
        year: "2025",
        cover: "assets/images/commercial/Hokki (3).webp",
        position: "center center",
        links: [
        { label: "品牌官方網站", url: "https://hokki.shoplineapp.com/" },
        { label: "Instagram 貼文", url: "https://www.instagram.com/p/DRtAixbEgbt/?img_index=1" }
        ],
        photos: [
          "assets/images/commercial/Hokki (1).webp",
          "assets/images/commercial/Hokki (2).webp",
          "assets/images/commercial/Hokki (3).webp",
          "assets/images/commercial/Hokki (4).webp",
          "assets/images/commercial/Hokki (5).webp",
          "assets/images/commercial/Hokki (6).webp",
        ],
        description: "極簡暗調的香氛美學。"
      },
      {
        id: "comm-5",
        title: "棒球女孩LOLO-美若康矽水膠隱形眼鏡中職明星賽抽獎活動視覺",
        client: "Miacare",
        year: "2025",
        cover: "assets/images/commercial/LoloMiacare (1).webp",
        links: [
        { label: "Miacare 美若康 貼文", url: "https://www.facebook.com/Miacareservice/photos/711-14-lolo-%E5%8B%95%E6%84%9F%E6%87%89%E6%8F%B4-%E8%88%92%E9%81%A9%E8%BF%BD%E7%90%83%E5%B0%B1%E9%9D%A0%E7%BE%8E%E8%8B%A5%E5%BA%B7%E6%8A%BD%E9%96%80%E7%A5%A8%E4%BE%86%E4%BE%86%E4%BE%86%E4%B8%AD%E8%81%B7%E6%98%8E%E6%98%9F%E8%B3%BD%E5%B0%87%E5%9C%A8-719-720-%E7%86%B1%E8%A1%80%E9%96%8B%E8%B7%91%E7%9C%8B%E7%90%83%E8%B3%BD%E6%9C%80%E9%87%8D%E8%A6%81%E7%9A%84%E5%B0%B1%E6%98%AF%E8%88%92%E9%81%A9%E7%9A%84%E8%A6%96%E8%A6%BA%E9%AB%94%E9%A9%97%E7%BE%8E%E8%8B%A5%E5%BA%B7%E7%89%B9%E5%88%A5%E9%82%80%E8%AB%8B-lolo/1178670870967949/" }
        ],
        photos: [
          "assets/images/commercial/LoloMiacare (1).webp",
          "assets/images/commercial/LoloMiacare (2).webp",
        ],
        description: "美若康隱形眼鏡"
      },
      {
        id: "comm-6",
        title: "棒球女孩LOLO-ACMEITEM輕量連帽防潑水外套",
        client: "ACMEITEM",
        year: "2025",
        cover: "assets/images/commercial/LoloAcmeitem (1).webp",
        links: [
        { label: "LOLO 小紅書 貼文", url: "https://xhslink.com/a/9D4ppIjhZNk9" }
        ],
        photos: [
          "assets/images/commercial/LoloAcmeitem (1).webp",
          "assets/images/commercial/LoloAcmeitem (2).webp",
          "assets/images/commercial/LoloAcmeitem (3).webp",
          "assets/images/commercial/LoloAcmeitem (4).webp",
          "assets/images/commercial/LoloAcmeitem (5).webp",
        ],
        description: "球場上的清爽微風，淡紫灰色的防潑水外套襯托出自然好氣色"
      },
      {
        id: "comm-7",
        title: "LIGHTZIP 秒收捲捲包 27-32L 輕量化後背包",
        client: "PNGL",
        year: "2025",
        cover: "assets/images/commercial/PNGL (3).webp",
        position: "center 20%",
        links: [
        { label: "Instagram 貼文", url: "https://www.instagram.com/p/DJloNuMpnxU/?img_index=1" }
        ],
        photos: [
          "assets/images/commercial/PNGL (1).webp",
          "assets/images/commercial/PNGL (2).webp",
          "assets/images/commercial/PNGL (3).webp",
          "assets/images/commercial/PNGL (4).webp",
          "assets/images/commercial/PNGL (5).webp",
        ],
        description: "機能包也能日常背！超輕量又防水！"
      },
      {
        id: "comm-8",
        title: "20-40mm f/2.8 Di III VXD",
        client: "Tamron",
        year: "2025",
        cover: "assets/images/commercial/TamronA062 (1).webp",
        position: "50% 0%",
        links: [
        { label: "Instagram 貼文", url: "https://www.instagram.com/p/DNmro31hpW_/?img_index=1" }
        ],
        photos: [
          "assets/images/commercial/TamronA062 (1).webp",
          "assets/images/commercial/TamronA062 (2).webp",
          "assets/images/commercial/TamronA062 (3).webp",
        ],
        description: "鏡頭評測"
      },
      {
        id: "comm-9",
        title: "25-200mm f/2.8-5.6 DiIII VXD G2",
        client: "Tamron",
        year: "2026",
        cover: "assets/images/commercial/TamronA075 (2).webp",
        links: [
        { label: "Instagram 貼文", url: "https://www.instagram.com/p/DaT-NJVGcDO/?img_index=1" }
        ],
        photos: [
          "assets/images/commercial/TamronA075 (1).webp",
          "assets/images/commercial/TamronA075 (2).webp",
          "assets/images/commercial/TamronA075 (3).webp",
          "assets/images/commercial/TamronA075 (4).webp",
          "assets/images/commercial/TamronA075 (5).webp",
          "assets/images/commercial/TamronA075 (6).webp",
        ],
        description: "鏡頭評測"
      },
      {
        id: "comm-10",
        title: "Pentax 17 底片相機",
        client: "PENTAX",
        year: "2024",
        cover: "assets/images/commercial/PENTAX17 (1).webp",
        links: [
        { label: "Instagram 貼文", url: "https://www.instagram.com/p/DDEi4Tmv7TO/?img_index=1" }
        ],
        photos: [
          "assets/images/commercial/PENTAX17 (1).webp",
          "assets/images/commercial/PENTAX17 (2).webp",
          "assets/images/commercial/PENTAX17 (3).webp",
          "assets/images/commercial/PENTAX17 (4).webp",
          "assets/images/commercial/PENTAX17 (5).webp",
          "assets/images/commercial/PENTAX17 (6).webp",
          "assets/images/commercial/PENTAX17 (7).webp",
          "assets/images/commercial/PENTAX17 (8).webp",
          "assets/images/commercial/PENTAX17 (9).webp",
          "assets/images/commercial/PENTAX17 (10).webp",
        ],
        description: "器材評測"
      },
    ],
    portrait: [
      {
        id: "port-1",
        title: "棒球女孩LOLO-日系主題拍攝",
        client: "LOLO",
        year: "2025",
        cover: "assets/images/portrait/LOLO (7).webp",
        position: "bottom center", // 👈 可設定 "top center", "center 30%", "bottom center" 調整焦點!
        links: [
        { label: "Instagram 貼文", url: "https://www.instagram.com/p/DFb0lpdPr9L/?img_index=1" }
        ],
        photos: [
          "assets/images/portrait/LOLO (11).webp",
          "assets/images/portrait/LOLO (2).webp",
          "assets/images/portrait/LOLO (4).webp",
          "assets/images/portrait/LOLO (5).webp",
          "assets/images/portrait/LOLO (6).webp",
          "assets/images/portrait/LOLO (7).webp",
          "assets/images/portrait/LOLO (8).webp",
          "assets/images/portrait/LOLO (9).webp",
          "assets/images/portrait/LOLO (10).webp",
          "assets/images/portrait/LOLO (3).webp",
          "assets/images/portrait/LOLO (1).webp",
        ],
        description: "純淨藍天下的日系青春映象"
      },
      {
        id: "port-2",
        title: "昭和浪漫-梓曦",
        client: "Zixic",
        year: "2025",
        cover: "assets/images/portrait/Zixic (6).webp",
        position: "10% 65%",
        links: [
        { label: "Instagram 貼文", url: "https://www.instagram.com/p/DPwUtZOjo0c/?img_index=1" }
        ],
        photos: [
          "assets/images/portrait/Zixic (1).webp",
          "assets/images/portrait/Zixic (2).webp",
          "assets/images/portrait/Zixic (3).webp",
          "assets/images/portrait/Zixic (4).webp",
          "assets/images/portrait/Zixic (5).webp",
          "assets/images/portrait/Zixic (6).webp",
          "assets/images/portrait/Zixic (7).webp",
          "assets/images/portrait/Zixic (8).webp",
          "assets/images/portrait/Zixic (9).webp",
          "assets/images/portrait/Zixic (10).webp",
          "assets/images/portrait/Zixic (11).webp",
          "assets/images/portrait/Zixic (12).webp",
          "assets/images/portrait/Zixic (13).webp",
        ],
        description: "昭和街角的午後時光"
      },
      {
        id: "port-3",
        title: "台灣感性主題拍攝",
        client: "Farah",
        year: "2026",
        cover: "assets/images/portrait/Farah (2).webp",
        position: "center 65%",
        photos: [
          "assets/images/portrait/Farah (1).webp",
          "assets/images/portrait/Farah (2).webp",
          "assets/images/portrait/Farah (3).webp",
          "assets/images/portrait/Farah (4).webp",
          "assets/images/portrait/Farah (5).webp",
          "assets/images/portrait/Farah (6).webp",
          "assets/images/portrait/Farah (7).webp",
          "assets/images/portrait/Farah (8).webp",
        ],
        description: "穿梭於台灣舊巷弄的光影故事"
      },
      {
        id: "port-4",
        title: "眷村人像主題拍攝",
        client: "陳小羊",
        year: "2025",
        cover: "assets/images/portrait/陳小羊 (9).webp",
        photos: [
          "assets/images/portrait/陳小羊 (1).webp",
          "assets/images/portrait/陳小羊 (2).webp",
          "assets/images/portrait/陳小羊 (3).webp",
          "assets/images/portrait/陳小羊 (4).webp",
          "assets/images/portrait/陳小羊 (5).webp",
          "assets/images/portrait/陳小羊 (6).webp",
          "assets/images/portrait/陳小羊 (7).webp",
          "assets/images/portrait/陳小羊 (8).webp",
          "assets/images/portrait/陳小羊 (9).webp",
          "assets/images/portrait/陳小羊 (10).webp",
        ],
        description: "時光倒流的眷村記憶"
      },
      {
        id: "port-5",
        title: "後來的我們與當時的青春",
        client: "みに",
        year: "2025",
        cover: "assets/images/portrait/Mini (2).webp",
        position: "center 60%",
        photos: [
          "assets/images/portrait/Mini (1).webp",
          "assets/images/portrait/Mini (2).webp",
          "assets/images/portrait/Mini (3).webp",
          "assets/images/portrait/Mini (4).webp",
          "assets/images/portrait/Mini (5).webp",
          "assets/images/portrait/Mini (6).webp",
          "assets/images/portrait/Mini (7).webp",
          "assets/images/portrait/Mini (8).webp",
        ],
        description: "穿上制服，我們再度重逢"
      },
      {
        id: "port-6",
        title: "迪化街的時光漫遊",
        client: "Peggy",
        year: "2025",
        cover: "assets/images/portrait/Peggy (1).webp",
        position: "55% 90%",
        photos: [
          "assets/images/portrait/Peggy (1).webp",
          "assets/images/portrait/Peggy (2).webp",
          "assets/images/portrait/Peggy (3).webp",
          "assets/images/portrait/Peggy (4).webp",
          "assets/images/portrait/Peggy (5).webp",
          "assets/images/portrait/Peggy (6).webp",
          "assets/images/portrait/Peggy (7).webp",
          "assets/images/portrait/Peggy (8).webp",
          "assets/images/portrait/Peggy (9).webp",
          "assets/images/portrait/Peggy (10).webp",
        ],
        description: "在歲月痕跡裡尋找舊城記憶"
      },
      {
        id: "port-7",
        title: "泰崗櫻花下的古風漢服",
        client: "飄逸",
        year: "2025",
        cover: "assets/images/portrait/飄逸 (3).webp",
        position: "60% 50%",
        photos: [
          "assets/images/portrait/飄逸 (1).webp",
          "assets/images/portrait/飄逸 (2).webp",
          "assets/images/portrait/飄逸 (3).webp",
        ],
        description: "屬於東方的浪漫悸動"
      },
      {
        id: "port-8",
        title: "聖誕全家福寫真",
        client: "Christmas",
        year: "2024",
        cover: "assets/images/portrait/CH1218 (2).webp",
        position: "50% 50%",
        photos: [
          "assets/images/portrait/CH1218 (4).webp",
          "assets/images/portrait/CH1218 (5).webp",
          "assets/images/portrait/CH1218 (3).webp",
          "assets/images/portrait/CH1218 (2).webp",
          "assets/images/portrait/CH1218 (1).webp",
        ],
        description: "點亮冬夜的幸福時光"
      },
      {
        id: "port-9",
        title: "城市裡的小確幸",
        client: "Passerby",
        year: "2024-2025",
        cover: "assets/images/portrait/passerby (3).webp",
        position: "30% 70%",
        photos: [
          "assets/images/portrait/passerby (3).webp",
          "assets/images/portrait/passerby (9).webp",
          "assets/images/portrait/passerby (7).webp",
          "assets/images/portrait/passerby (10).webp",
          "assets/images/portrait/passerby (8).webp",
          "assets/images/portrait/passerby (2).webp",
        ],
        description: "那是只有我們，才能懂的日常風景"
      },
      {
        id: "port-10",
        title: "街頭百態",
        client: "Passerby",
        year: "2025",
        cover: "assets/images/portrait/passerby (4).webp",
        position: "25% 70%",
        photos: [
          "assets/images/portrait/passerby (1).webp",
          "assets/images/portrait/passerby (4).webp",
          "assets/images/portrait/passerby (5).webp",
          "assets/images/portrait/passerby (6).webp",
        ],
        description: "在忙碌的都市節奏中，定格那份隨性與真實"
      },
    ],
    concert: [
      {
        id: "conc-1",
        title: "喬山50週年感恩慈善演唱會",
        client: "臺北大巨蛋",
        year: "2026",
        cover: "assets/images/concert/911 (1).webp",
        position: "center center",
        photos: [
          "assets/images/concert/911 (1).webp",
          "assets/images/concert/911 (2).webp",
          "assets/images/concert/911 (3).webp",
          "assets/images/concert/911 (4).webp",
          "assets/images/concert/911 (5).webp",
          "assets/images/concert/911 (6).webp",
          "assets/images/concert/911 (7).webp",
        ],
        description: "feat. 玖壹壹"
      },
      {
        id: "conc-2",
        title: "喬山50週年感恩慈善演唱會",
        client: "臺北大巨蛋",
        year: "2026",
        cover: "assets/images/concert/ALin (2).webp",
        position: "center center",
        photos: [
          "assets/images/concert/ALin (1).webp",
          "assets/images/concert/ALin (2).webp",
          "assets/images/concert/ALin (3).webp",
          "assets/images/concert/ALin (4).webp",
          "assets/images/concert/ALin (5).webp",
          "assets/images/concert/ALin (6).webp",
          "assets/images/concert/ALin (7).webp",
          "assets/images/concert/ALin (8).webp",
        ],
        description: "feat. A-Lin"
      },
      {
        id: "conc-3",
        title: "喬山50週年感恩慈善演唱會",
        client: "臺北大巨蛋",
        year: "2026",
        cover: "assets/images/concert/EricChou (4).webp",
        position: "bottom center",
        scale: 1.3,
        photos: [
          "assets/images/concert/EricChou (1).webp",
          "assets/images/concert/EricChou (2).webp",
          "assets/images/concert/EricChou (3).webp",
          "assets/images/concert/EricChou (4).webp",
          "assets/images/concert/EricChou (5).webp",
          "assets/images/concert/EricChou (6).webp",
        ],
        description: "feat. 周興哲"
      },
      {
        id: "conc-4",
        title: "喬山50週年感恩慈善演唱會",
        client: "臺北大巨蛋",
        year: "2026",
        cover: "assets/images/concert/CrowdLu (8).webp",
        position: "35% 60%",
        photos: [
          "assets/images/concert/CrowdLu (1).webp",
          "assets/images/concert/CrowdLu (2).webp",
          "assets/images/concert/CrowdLu (3).webp",
          "assets/images/concert/CrowdLu (4).webp",
          "assets/images/concert/CrowdLu (5).webp",
          "assets/images/concert/CrowdLu (6).webp",
          "assets/images/concert/CrowdLu (7).webp",
          "assets/images/concert/CrowdLu (8).webp",
        ],
        description: "feat. 盧廣仲"
      },
      {
        id: "conc-5",
        title: "喬山50週年感恩慈善演唱會",
        client: "臺北大巨蛋",
        year: "2026",
        cover: "assets/images/concert/AccuseFive (2).webp",
        position: "center center",
        photos: [
          "assets/images/concert/AccuseFive (1).webp",
          "assets/images/concert/AccuseFive (2).webp",
          "assets/images/concert/AccuseFive (3).webp",
          "assets/images/concert/AccuseFive (4).webp",
          "assets/images/concert/AccuseFive (5).webp",
          "assets/images/concert/AccuseFive (6).webp",
          "assets/images/concert/AccuseFive (7).webp",
          "assets/images/concert/AccuseFive (8).webp",
        ],
        description: "feat. 告五人"
      },
      {
        id: "conc-6",
        title: "2025 茉ひる ASIA TOUR『SeRendipity』in TAIPEI",
        client: "Legacy Tera",
        year: "2025",
        cover: "assets/images/concert/Mahiru (1).webp",
        position: "bottom center",
        scale: 1.1,
        photos: [
          "assets/images/concert/Mahiru (1).webp",
          "assets/images/concert/Mahiru (2).webp",
          "assets/images/concert/Mahiru (3).webp",
          "assets/images/concert/Mahiru (4).webp",
          "assets/images/concert/Mahiru (5).webp",
          "assets/images/concert/Mahiru (6).webp",
          "assets/images/concert/Mahiru (7).webp",
          "assets/images/concert/Mahiru (8).webp",
          "assets/images/concert/Mahiru (9).webp",
          "assets/images/concert/Mahiru (10).webp",
        ],
        description: "2025.05.31｜feat. Rinzo, 派偉俊"
      },
      {
        id: "conc-7",
        title: "2025 茉ひる ASIA TOUR 『SeRendipity』",
        client: "MAHIRU",
        year: "2025",
        cover: "assets/images/concert/MahiruGoods (1).webp",
        photos: [
          "assets/images/concert/MahiruGoods (1).webp",
          "assets/images/concert/MahiruGoods (2).webp",
          "assets/images/concert/MahiruGoods (3).webp",
        ],
        description: "香港 曼谷 大阪 東京 高雄 台北｜周邊商品"
      },
      {
        id: "conc-8",
        title: "2024邱振哲-聖誕夜快閃演出",
        client: "Pika Chiu",
        year: "2024",
        cover: "assets/images/concert/PikaChiu1224 (1).webp",
        position: "50% 90%",
        scale: 1.0,
        photos: [
          "assets/images/concert/PikaChiu1224 (1).webp",
          "assets/images/concert/PikaChiu1224 (2).webp",
          "assets/images/concert/PikaChiu1224 (3).webp",
          "assets/images/concert/PikaChiu1224 (4).webp",
          "assets/images/concert/PikaChiu1224 (5).webp",
          "assets/images/concert/PikaChiu1224 (6).webp",
          "assets/images/concert/PikaChiu1224 (7).webp",
          "assets/images/concert/PikaChiu1224 (8).webp",
          "assets/images/concert/PikaChiu1224 (9).webp",
          "assets/images/concert/PikaChiu1224 (10).webp",
        ],
        description: "西門誠品武昌"
      },
    ],
    event: [
      {
        id: "ev-1",
        title: "喬山50週年感恩慈善演唱會",
        client: "臺北大巨蛋",
        year: "2026",
        cover: "assets/images/event/Lulu (2).webp",
        position: "40% 85%",
        scale: 1.2,
        links: [
        { label: "Lulu Instagram 貼文", url: "https://www.instagram.com/p/DTyASBCEj_b/" }
        ],
        photos: [
          "assets/images/event/Lulu (1).webp",
          "assets/images/event/Lulu (2).webp",
          "assets/images/event/Lulu (3).webp",
          "assets/images/event/Lulu (4).webp",
          "assets/images/event/Lulu (5).webp",
          "assets/images/event/Lulu (6).webp",
          "assets/images/event/Lulu (7).webp",
          "assets/images/event/Lulu (8).webp",
        ],
        description: "feat. 陳漢典、Lulu"
      },
      {
        id: "ev-2",
        title: "北科大114年校慶",
        client: "NTUT",
        year: "2025",
        cover: "assets/images/event/NTUT114 (3).webp",
        links: [
        { label: "工商時報", url: "https://www.ctee.com.tw/news/20251101700632-431204" },
        { label: "自由時報", url: "https://news.ltn.com.tw/news/Taipei/breakingnews/5231061" },
        { label: "經濟日報", url: "https://money.udn.com/money/story/5723/9111589" },
        { label: "中央通訊社", url: "https://www.cna.com.tw/news/ahel/202511010121.aspx" },
        { label: "北科新聞", url: "https://news.ntut.edu.tw/p/406-1000-149442,r11.php?Lang=zh-tw" },
        { label: "NOWNEWS", url: "https://www.nownews.com/news/6749187" },
        { label: "YAHOO奇摩", url: "https://tw.news.yahoo.com/%E7%8E%8B%E4%B8%96%E5%A0%85%EF%BC%9A%E5%BE%9E%E6%94%BF20%E5%B9%B4%E4%BE%86%E6%9C%80%E5%85%89%E6%A6%AE%E7%9A%84%E4%B8%80%E5%A4%A9%EF%BC%81%E7%8D%B2%E9%A0%92%E5%8C%97%E7%A7%91%E5%A4%A7%E5%90%8D%E8%AD%BD%E5%8D%9A%E5%A3%AB-%E5%9B%9E%E6%86%B6%E5%B9%B4%E5%B0%91%E8%88%8A%E6%9B%B8%E6%94%A4%E6%84%9F%E5%8B%95-072253911.html" }
        ],
        photos: [
          "assets/images/event/NTUT114 (1).webp",
          "assets/images/event/NTUT114 (2).webp",
          "assets/images/event/NTUT114 (3).webp",
          "assets/images/event/NTUT114 (4).webp",
          "assets/images/event/NTUT114 (5).webp",
          "assets/images/event/NTUT114 (6).webp",
          "assets/images/event/NTUT114 (7).webp",
          "assets/images/event/NTUT114 (8).webp",
          "assets/images/event/NTUT114 (9).webp",
          "assets/images/event/NTUT114 (10).webp",
          "assets/images/event/NTUT114 (11).webp",
          "assets/images/event/NTUT114 (12).webp",
          "assets/images/event/NTUT114 (13).webp",
          "assets/images/event/NTUT114 (14).webp",
          "assets/images/event/NTUT114 (15).webp",
        ],
        description: "表彰卓越貢獻傑出校友｜顏志發資政、王世堅委員、林添茂董座 獲頒名譽博士"
      },
      {
        id: "ev-3",
        title: "《空白織上》",
        client: "AEUST",
        year: "2026",
        cover: "assets/images/event/EspaceLibre (1).webp",
        position: "50% 35%",
        scale: 1.4,
        photos: [
          "assets/images/event/EspaceLibre (1).webp",
          "assets/images/event/EspaceLibre (2).webp",
          "assets/images/event/EspaceLibre (3).webp",
          "assets/images/event/EspaceLibre (4).webp",
          "assets/images/event/EspaceLibre (5).webp",
          "assets/images/event/EspaceLibre (6).webp",
          "assets/images/event/EspaceLibre (7).webp",
          "assets/images/event/EspaceLibre (8).webp",
          "assets/images/event/EspaceLibre (9).webp",
          "assets/images/event/EspaceLibre (10).webp",
          "assets/images/event/EspaceLibre (11).webp",
          "assets/images/event/EspaceLibre (12).webp",
          "assets/images/event/EspaceLibre (13).webp",
          "assets/images/event/EspaceLibre (14).webp",
          "assets/images/event/EspaceLibre (15).webp",
        ],
        description: "亞東科技大學材料織品服裝系第十二屆專題成果展"
      },
      {
        id: "ev-4",
        title: "LiFUNd 第三屆夢想啟航",
        client: "LiFUNd",
        year: "2026",
        cover: "assets/images/event/1.webp",
        links: [
        { label: "經濟日報", url: "https://money.udn.com/money/story/5635/9386900" }
        ],
        photos: [
          "assets/images/event/1.webp",
          "assets/images/event/2.webp",
          "assets/images/event/3.webp",
          "assets/images/event/4.webp",
          "assets/images/event/5.webp"
        ],
        description: "2026.03.06"
      },
      {
        id: "ev-5",
        title: "SITCON 2026 學生計算機年會",
        client: "SITCON",
        year: "2026",
        cover: "assets/images/event/10.webp",
        position: "40% 70%",
        photos: [
          "assets/images/event/6.webp",
          "assets/images/event/7.webp",
          "assets/images/event/8.webp",
          "assets/images/event/9.webp",
          "assets/images/event/10.webp"
        ],
        description: "中央研究院"
      },
      {
        id: "ev-6",
        title: "2026 Threads’ Party",
        client: "Treads",
        year: "2026",
        cover: "assets/images/event/15.webp",
        photos: [
          "assets/images/event/11.webp",
          "assets/images/event/12.webp",
          "assets/images/event/13.webp",
          "assets/images/event/14.webp",
          "assets/images/event/15.webp"
        ],
        description: "第一屆美式畢業舞會暨春酒晚宴"
      },
      {
        id: "ev-7",
        title: "閃動格子 CyberCube",
        client: "CyberCube",
        year: "2026",
        cover: "assets/images/event/16.webp",
        photos: [
          "assets/images/event/16.webp",
          "assets/images/event/17.webp",
          "assets/images/event/18.webp",
          "assets/images/event/19.webp",
          "assets/images/event/20.webp"
        ],
        description: "臺北市2026高中職升學進路博覽會"
      },
      {
        id: "ev-8",
        title: "亞洲達人大環秀-楊世豪",
        client: "奇美博物館",
        year: "2025",
        cover: "assets/images/event/22.webp",
        position: "50% 60%",
        photos: [
          "assets/images/event/21.webp",
          "assets/images/event/22.webp",
          "assets/images/event/23.webp",
          "assets/images/event/24.webp",
          "assets/images/event/25.webp"
        ],
        description: "許耀中舞蹈教室「舞極X唯一」國標舞晚宴"
      },
      {
        id: "ev-9",
        title: "玖壹壹 X 楊世豪",
        client: "臺北大巨蛋",
        year: "2026",
        cover: "assets/images/event/ShihhaoDome (1).webp",
        photos: [
          "assets/images/event/ShihhaoDome (1).webp",
          "assets/images/event/ShihhaoDome (2).webp",
          "assets/images/event/ShihhaoDome (3).webp",
          "assets/images/event/ShihhaoDome (4).webp",
          "assets/images/event/ShihhaoDome (5).webp",
          "assets/images/event/ShihhaoDome (6).webp",
          "assets/images/event/ShihhaoDome (7).webp",
          "assets/images/event/ShihhaoDome (8).webp",
        ],
        description: "喬山50週年感恩慈善演唱會"
      },
      {
        id: "ev-10",
        title: "2025 馬戲之門年度製作《狂歡舞會》",
        client: "CIRCUS GATE",
        year: "2025",
        cover: "assets/images/event/28.webp",
        position: "60% 50%",
        photos: [
          "assets/images/event/26.webp",
          "assets/images/event/27.webp",
          "assets/images/event/28.webp",
          "assets/images/event/29.webp",
          "assets/images/event/30.webp"
        ],
        description: "誠品黑盒子"
      },
      {
        id: "ev-11",
        title: "《Patikol 洄巢—Torik部落創作樂舞劇場》",
        client: "NTUT Aliyan",
        year: "2025",
        cover: "assets/images/event/31.webp",
        position: "50% 90%",
        scale: 1.2,
        photos: [
          "assets/images/event/31.webp",
          "assets/images/event/32.webp",
          "assets/images/event/33.webp",
          "assets/images/event/34.webp",
          "assets/images/event/35.webp"
        ],
        description: "國立臺北科技大學Aliyan原住民文化研究社"
      },
      {
        id: "ev-12",
        title: "2025 北科國際處秋季國際學生期中茶歇",
        client: "NTUT OIA",
        year: "2025",
        cover: "assets/images/event/38.webp",
        photos: [
          "assets/images/event/36.webp",
          "assets/images/event/37.webp",
          "assets/images/event/38.webp",
          "assets/images/event/39.webp",
          "assets/images/event/40.webp"
        ],
        description: "2025.10.29"
      },
      {
        id: "ev-13",
        title: "綠色力量生活節",
        client: "TFG X Taipei 101",
        year: "2025",
        cover: "assets/images/event/42.webp",
        position: "70% 50%",
        photos: [
          "assets/images/event/41.webp",
          "assets/images/event/42.webp",
          "assets/images/event/43.webp",
          "assets/images/event/44.webp",
          "assets/images/event/45.webp"
        ],
        description: "臺北101 X 臺北市立第一女子高級中學"
      },
      {
        id: "ev-14",
        title: "2025北海夜金閃閃-北海潮與火",
        client: "NTPC",
        year: "2025",
        cover: "assets/images/event/50.webp",
        photos: [
          "assets/images/event/46.webp",
          "assets/images/event/47.webp",
          "assets/images/event/48.webp",
          "assets/images/event/49.webp",
          "assets/images/event/50.webp"
        ],
        description: "2025.08.24"
      },
      {
        id: "ev-15",
        title: "2024 Computex Taipei",
        client: "Computex",
        year: "2024",
        cover: "assets/images/event/53.webp",
        photos: [
          "assets/images/event/51.webp",
          "assets/images/event/52.webp",
          "assets/images/event/53.webp",
          "assets/images/event/54.webp",
          "assets/images/event/55.webp"
        ],
        description: "臺北國際電腦展"
      },
      {
        id: "ev-16",
        title: "甲辰龍年頭份合港田寮永貞宮參香台北池合宮",
        client: "TOUFEN",
        year: "2024",
        cover: "assets/images/event/20241208 (5).webp",
        photos: [
          "assets/images/event/20241208 (1).webp",
          "assets/images/event/20241208 (2).webp",
          "assets/images/event/20241208 (3).webp",
          "assets/images/event/20241208 (4).webp",
          "assets/images/event/20241208 (5).webp",
          "assets/images/event/20241208 (6).webp",
          "assets/images/event/20241208 (7).webp",
          "assets/images/event/20241208 (8).webp",
          "assets/images/event/20241208 (9).webp",
          "assets/images/event/20241208 (10).webp",
          "assets/images/event/20241208 (11).webp",
          "assets/images/event/20241208 (12).webp",
          "assets/images/event/20241208 (13).webp",
          "assets/images/event/20241208 (14).webp",
        ],
        description: "2024.12.08"
      },
      {
        id: "ev-17",
        title: "113年度苗栗縣客家文藝協會「粽溫飄香慶端午 DIY 暨節能減碳宣導」活動",
        client: "TOUFEN",
        year: "2024",
        cover: "assets/images/event/20240608 (5).webp",
        position: "0% 5%",
        photos: [
          "assets/images/event/20240608 (1).webp",
          "assets/images/event/20240608 (2).webp",
          "assets/images/event/20240608 (3).webp",
          "assets/images/event/20240608 (4).webp",
          "assets/images/event/20240608 (5).webp",
          "assets/images/event/20240608 (6).webp",
          "assets/images/event/20240608 (7).webp",
          "assets/images/event/20240608 (8).webp",
          "assets/images/event/20240608 (9).webp",
        ],
        description: "粽子準備過程記錄"
      },
      {
        id: "ev-18",
        title: "115年慶贊中元｜手作客家新丁粄紀實",
        client: "TOUFEN",
        year: "2025",
        cover: "assets/images/event/20250830 (5).webp",
        photos: [
          "assets/images/event/20250830 (1).webp",
          "assets/images/event/20250830 (2).webp",
          "assets/images/event/20250830 (3).webp",
          "assets/images/event/20250830 (4).webp",
          "assets/images/event/20250830 (5).webp",
          "assets/images/event/20250830 (6).webp",
        ],
        description: "頭份合港田寮永貞宮｜頭田慶讚中元普渡大法會"
      }
    ],
    sports: [
      {
        id: "sp-1",
        title: "LG TWINS X DRAGONS聯名主題日",
        client: "臺北大巨蛋",
        year: "2026",
        cover: "assets/images/sports/WDragons0526 (1).webp",
        position: "50% 85%",
        photos: [
          "assets/images/sports/WDragons0526 (1).webp",
          "assets/images/sports/WDragons0526 (2).webp",
          "assets/images/sports/WDragons0526 (3).webp",
          "assets/images/sports/WDragons0526 (4).webp",
          "assets/images/sports/WDragons0526 (5).webp",
          "assets/images/sports/WDragons0526 (6).webp",
          "assets/images/sports/WDragons0526 (7).webp",
          "assets/images/sports/WDragons0526 (8).webp",
          "assets/images/sports/WDragons0526 (9).webp",
          "assets/images/sports/WDragons0526 (10).webp",
          "assets/images/sports/WDragons0526 (11).webp",
          "assets/images/sports/WDragons0526 (12).webp",
          "assets/images/sports/WDragons0526 (13).webp",
          "assets/images/sports/WDragons0526 (14).webp",
          "assets/images/sports/WDragons0526 (15).webp",
          "assets/images/sports/WDragons0526 (16).webp",
          "assets/images/sports/WDragons0526 (17).webp",
          "assets/images/sports/WDragons0526 (18).webp",
        ],
        description: "2026.05.26"
      },
      {
        id: "sp-2",
        title: "PLG/富邦勇士2025-2026主場開幕戰",
        client: "臺北和平籃球館",
        year: "2025",
        cover: "assets/images/sports/FubonBraves1109 (9).webp",
        position: "bottom center",
        photos: [
          "assets/images/sports/FubonBraves1109 (1).webp",
          "assets/images/sports/FubonBraves1109 (2).webp",
          "assets/images/sports/FubonBraves1109 (3).webp",
          "assets/images/sports/FubonBraves1109 (4).webp",
          "assets/images/sports/FubonBraves1109 (5).webp",
          "assets/images/sports/FubonBraves1109 (6).webp",
          "assets/images/sports/FubonBraves1109 (7).webp",
          "assets/images/sports/FubonBraves1109 (8).webp",
          "assets/images/sports/FubonBraves1109 (9).webp",
          "assets/images/sports/FubonBraves1109 (10).webp",
        ],
        description: "2025.11.09"
      },
      {
        id: "sp-3",
        title: "中華職棒35年例行賽9/15(日)",
        client: "臺北大巨蛋",
        year: "2024",
        cover: "assets/images/sports/WDragons (1).webp",
        position: "60% 60%",
        photos: [
          "assets/images/sports/WDragons (1).webp",
          "assets/images/sports/WDragons (2).webp",
          "assets/images/sports/WDragons (3).webp",
          "assets/images/sports/WDragons (4).webp",
          "assets/images/sports/WDragons (5).webp",
          "assets/images/sports/WDragons (6).webp",
          "assets/images/sports/WDragons (7).webp",
          "assets/images/sports/WDragons (8).webp",
        ],
        description: "2024.09.15"
      },
      {
        id: "sp-4",
        title: "114年臺北市學生棒球秋季聯賽",
        client: "迎風河濱棒球場",
        year: "2025",
        cover: "assets/images/sports/NtutBaseball0930 (1).webp",
        position: "50% 70%",
        links: [
        { label: "北科棒球隊 Instagram 貼文", url: "https://www.instagram.com/p/DPTwKx_ktBt/?img_index=1" }
        ],
        photos: [
          "assets/images/sports/NtutBaseball0930 (1).webp",
          "assets/images/sports/NtutBaseball0930 (2).webp",
          "assets/images/sports/NtutBaseball0930 (3).webp",
          "assets/images/sports/NtutBaseball0930 (4).webp",
          "assets/images/sports/NtutBaseball0930 (5).webp",
          "assets/images/sports/NtutBaseball0930 (6).webp",
          "assets/images/sports/NtutBaseball0930 (7).webp",
          "assets/images/sports/NtutBaseball0930 (8).webp",
          "assets/images/sports/NtutBaseball0930 (9).webp",
          "assets/images/sports/NtutBaseball0930 (10).webp",
          "assets/images/sports/NtutBaseball0930 (11).webp",
          "assets/images/sports/NtutBaseball0930 (12).webp",
          "assets/images/sports/NtutBaseball0930 (13).webp",
          "assets/images/sports/NtutBaseball0930 (14).webp",
          "assets/images/sports/NtutBaseball0930 (15).webp",
          "assets/images/sports/NtutBaseball0930 (16).webp",
          "assets/images/sports/NtutBaseball0930 (17).webp",
          "assets/images/sports/NtutBaseball0930 (18).webp",
          "assets/images/sports/NtutBaseball0930 (19).webp",
        ],
        description: "2025.10.02"
      },
      {
        id: "sp-5",
        title: "吉力吉撈·鞏冠｜Giljegiljaw Kungkuan",
        client: "臺北大巨蛋",
        year: "2024",
        cover: "assets/images/sports/Giljegiljaw (1).webp",
        position: "50% 50%",
        links: [
        { label: "吉力吉撈·鞏冠 Instagram 貼文", url: "https://www.instagram.com/p/DADMdyUS6-u/" }
        ],
        photos: [
          "assets/images/sports/Giljegiljaw (1).webp",
          "assets/images/sports/Giljegiljaw (2).webp",
          "assets/images/sports/Giljegiljaw (3).webp",
        ],
        description: "2024.09.15"
      },
      {
        id: "sp-6",
        title: "富藍戈｜Enderson Daniel Franco",
        client: "新莊棒球場",
        year: "2025",
        cover: "assets/images/sports/Franco.webp",
        position: "50% 60%",
        links: [
        { label: "富藍戈 Instagram 貼文", url: "https://www.instagram.com/p/DJHPCBzynVJ/" }
        ],
        photos: [
          "assets/images/sports/Franco.webp",
        ],
        description: "2025.04.22"
      },
      {
        id: "sp-7",
        title: "棒球女孩LOLO",
        client: "疏洪重新棒球場",
        year: "2025",
        cover: "assets/images/sports/Lolo (1).webp",
        position: "95% 5%",
        scale: 1.5,
        links: [
        { label: "LOLO Instagram 貼文", url: "https://www.instagram.com/p/DJBTLdES5kT/" }
        ],
        photos: [
          "assets/images/sports/Lolo (1).webp",
          "assets/images/sports/Lolo (2).webp",
          "assets/images/sports/Lolo (3).webp",
          "assets/images/sports/Lolo (4).webp",
        ],
        description: "2025.04.26"
      },
      {
        id: "sp-8",
        title: "中華民國115年全國大專校院運動會一般組北區羽球資格賽",
        client: "臺北體育館",
        year: "2026",
        cover: "assets/images/sports/NtutBadminton (3).webp",
        position: "60% 50%",
        links: [
        { label: "北科羽球隊 Instagram 貼文", url: "https://www.instagram.com/p/DW6O8WdFECu/?img_index=9" }
        ],
        photos: [
          "assets/images/sports/NtutBadminton (1).webp",
          "assets/images/sports/NtutBadminton (2).webp",
          "assets/images/sports/NtutBadminton (3).webp",
        ],
        description: "2026.03.25"
      },
      {
        id: "sp-9",
        title: "2024 Rising Star RG｜瑞星盃國際邀請賽",
        client: "Rising Star RG",
        year: "2024",
        cover: "assets/images/sports/20240705 (7).webp",
        photos: [
          "assets/images/sports/20240705 (1).webp",
          "assets/images/sports/20240705 (2).webp",
          "assets/images/sports/20240705 (3).webp",
          "assets/images/sports/20240705 (4).webp",
          "assets/images/sports/20240705 (5).webp",
          "assets/images/sports/20240705 (6).webp",
          "assets/images/sports/20240705 (7).webp",
        ],
        description: "2024.07.05"
      }
    ],
    graduation: [
      {
        id: "grad-1",
        title: "國立陽明交通大學",
        client: "NYCU",
        year: "2025",
        cover: "assets/images/graduation/NYCU (1).webp",
        position: "35% 50%",
        photos: [
          "assets/images/graduation/NYCU (1).webp",
          "assets/images/graduation/NYCU (2).webp",
          "assets/images/graduation/NYCU (3).webp",
          "assets/images/graduation/NYCU (4).webp",
          "assets/images/graduation/NYCU (5).webp",
          "assets/images/graduation/NYCU (6).webp"
        ],
        description: "博士照"
      },
      {
        id: "grad-2",
        title: "國立臺北科技大學",
        client: "NTUT",
        year: "2025",
        cover: "assets/images/graduation/NTUT (4).webp",
        position: "50% 60%",
        photos: [
          "assets/images/graduation/NTUT (1).webp",
          "assets/images/graduation/NTUT (2).webp",
          "assets/images/graduation/NTUT (3).webp",
          "assets/images/graduation/NTUT (4).webp",
          "assets/images/graduation/NTUT (5).webp",
          "assets/images/graduation/NTUT (6).webp",
          "assets/images/graduation/NTUT (7).webp",
          "assets/images/graduation/NTUT (8).webp",
        ],
        description: "碩士照"
      },
      {
        id: "grad-3",
        title: "國立臺北護理健康大學",
        client: "NTUNHS",
        year: "2025",
        cover: "assets/images/graduation/NTUNHS (7).webp",
        position: "50% 80%",
        photos: [
          "assets/images/graduation/NTUNHS (1).webp",
          "assets/images/graduation/NTUNHS (2).webp",
          "assets/images/graduation/NTUNHS (3).webp",
          "assets/images/graduation/NTUNHS (4).webp",
          "assets/images/graduation/NTUNHS (5).webp",
          "assets/images/graduation/NTUNHS (6).webp",
          "assets/images/graduation/NTUNHS (7).webp",
          "assets/images/graduation/NTUNHS (8).webp",
        ],
        description: "學士照"
      }
    ],
    landscape: [
      {
        id: "land26",
        title: "合龍之前：世紀之約",
        client: "Danjiang Bridge",
        year: "2026",
        cover: "assets/images/landscape/landscape1.webp",
        position: "60% 60%",
        scale: 1.5,
        links: [
        { label: "Instagram 貼文", url: "https://www.instagram.com/p/DYCL2foGb-e/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape1.webp"
        ],
        description: "在淡水河口，見證世界級地標從虛無到實體的誕生紀實。"
      },
      {
        id: "land-25",
        title: "盛夏的喧囂與寂靜",
        client: "Dadaocheng Fireworks",
        year: "2026",
        cover: "assets/images/landscape/landscape (1).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DbqMEVsAeG0/" }
        ],
        photos: [
          "assets/images/landscape/landscape (1).webp"
        ],
        description: "於老城頂樓，看萬家燈火與漫天花火同時綻放"
      },
      {
        id: "land-24",
        title: "極東的海潮時間",
        client: "Magang Fishing Village",
        year: "2026",
        cover: "assets/images/landscape/landscape (2).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/Da4SD_FmVwc/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (2).webp",
          "assets/images/landscape/landscape (3).webp",
          "assets/images/landscape/landscape (4).webp"
        ],
        description: "石厝與海蝕平台交錯，凝固台灣邊陲最寂靜的歲月"
      },
      {
        id: "land-23",
        title: "風車與暮色的交界",
        client: "Itoshima Kuroiso Coast",
        year: "2025",
        cover: "assets/images/landscape/landscape (5).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DVGMI28kx7l/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (5).webp",
          "assets/images/landscape/landscape (6).webp",
          "assets/images/landscape/landscape (7).webp",
          "assets/images/landscape/landscape (8).webp",
          "assets/images/landscape/landscape (9).webp",
          "assets/images/landscape/landscape (10).webp"
        ],
        description: "層巒遠山的輪廓裡，佇立著聽潮轉動的剪影"
      },
      {
        id: "land-22",
        title: "在遼闊世界裡遇見渺小的自己",
        client: "Aso",
        year: "2025",
        cover: "assets/images/landscape/landscape (11).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DWdqAQ5GZnk/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (11).webp",
          "assets/images/landscape/landscape (12).webp",
          "assets/images/landscape/landscape (13).webp",
          "assets/images/landscape/landscape (14).webp",
          "assets/images/landscape/landscape (15).webp"
        ],
        description: "漫步於金黃草原的褶皺中，感受火山包容萬物的心跳"
      },
      {
        id: "land-21",
        title: "日復一日的南國海岸",
        client: "Aoshima",
        year: "2025",
        cover: "assets/images/landscape/landscape (16).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DTg7ahdk6bq/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (16).webp"
        ],
        description: "陽光與微風落下的地方，停格著最平實的日常風景"
      },
      {
        id: "land-20",
        title: "當光觸碰了大海",
        client: "Hyuga Cape",
        year: "2025",
        cover: "assets/images/landscape/landscape (17).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DR2Dn8EE7yH/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (17).webp",
          "assets/images/landscape/landscape (18).webp",
          "assets/images/landscape/landscape (19).webp",
          "assets/images/landscape/landscape (20).webp",
          "assets/images/landscape/landscape (21).webp",
          "assets/images/landscape/landscape (22).webp",
          "assets/images/landscape/landscape (23).webp",
          "assets/images/landscape/landscape (24).webp"
        ],
        description: "芒花迎風搖曳，在蔚藍波光裡折射出閃耀的微光"
      },
      {
        id: "land-19",
        title: "歲月與神明的祝福",
        client: "Kato Shrine",
        year: "2025",
        cover: "assets/images/landscape/landscape (25).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "熊本市官方貼文", url: "https://www.instagram.com/p/DU9r74YD2oA/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (25).webp",
          "assets/images/landscape/landscape (26).webp",
          "assets/images/landscape/landscape (27).webp",
          "assets/images/landscape/landscape (28).webp",
          "assets/images/landscape/landscape (29).webp",
          "assets/images/landscape/landscape (30).webp"
        ],
        description: "銀杏與木造社殿交織，紀錄神前結婚儀式最莊嚴的誓言"
      },
      {
        id: "land-18",
        title: "童年的地平線",
        client: "Qingtiangang",
        year: "2025",
        cover: "assets/images/landscape/landscape (31).webp",
        position: "50% 50%",
        scale: 1.2,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DOVsSC4k1bE/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (31).webp",
          "assets/images/landscape/landscape (32).webp",
          "assets/images/landscape/landscape (33).webp",
          "assets/images/landscape/landscape (34).webp",
          "assets/images/landscape/landscape (35).webp"
        ],
        description: "微風徐徐的木欄杆旁，奔跑玩耍著最純粹的天真與快樂"
      },
      {
        id: "land-17",
        title: "飛向暮色的歸途",
        client: "Qingtiangang",
        year: "2025",
        cover: "assets/images/landscape/landscape (36).webp",
        position: "50% 50%",
        scale: 1.2,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DPRcXKnEwv0/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (36).webp",
          "assets/images/landscape/landscape (37).webp",
          "assets/images/landscape/landscape (38).webp",
          "assets/images/landscape/landscape (39).webp",
          "assets/images/landscape/landscape (40).webp",
          "assets/images/landscape/landscape (41).webp"
        ],
        description: "於夕陽餘暉的粉色天空，凝望遠方飛機與歸巢的飛鳥"
      },
      {
        id: "land-16",
        title: "大地共生的樂章",
        client: "Qingtiangang",
        year: "2025",
        cover: "assets/images/landscape/landscape (42).webp",
        position: "50% 50%",
        scale: 1.2,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DOqbzSukxJq/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (42).webp",
          "assets/images/landscape/landscape (43).webp",
          "assets/images/landscape/landscape (44).webp",
          "assets/images/landscape/landscape (45).webp",
          "assets/images/landscape/landscape (46).webp",
          "assets/images/landscape/landscape (47).webp"
        ],
        description: "草原上水牛與白鷺鷥和平共處，演繹自然界最美麗的平衡"
      },
      {
        id: "land-15",
        title: "潮汐間的童真記憶",
        client: "Laomei",
        year: "2025",
        cover: "assets/images/landscape/landscape (48).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DPYsaWekx0h/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (48).webp",
          "assets/images/landscape/landscape (49).webp",
          "assets/images/landscape/landscape (50).webp"
        ],
        description: "踏在綠意盎然的海蝕平台上，紀錄孩子們戲水捉蟹的純真時光"
      },
      {
        id: "land-14",
        title: "俯瞰幾何之城",
        client: "Urban Geometry",
        year: "2026",
        cover: "assets/images/landscape/landscape (51).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DVp3LzlGS4t/" }
        ],
        photos: [
          "assets/images/landscape/landscape (51).webp"
        ],
        description: "以上帝視角切開街巷脈絡，交織出日常生活的平行線"
      },
      {
        id: "land-13",
        title: "秋風裡的孤獨背影",
        client: "Lengshuikeng",
        year: "2025",
        cover: "assets/images/landscape/landscape (52).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DQkq2Llk3O5/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (52).webp",
          "assets/images/landscape/landscape (53).webp",
          "assets/images/landscape/landscape (54).webp",
          "assets/images/landscape/landscape (55).webp",
          "assets/images/landscape/landscape (56).webp"
        ],
        description: "沿著階梯走入銀白芒草，與整個秋天不期而遇"
      },
      {
        id: "land-12",
        title: "年節喧囂與老街歲月",
        client: "Dihua Street New Year Market",
        year: "2025",
        cover: "assets/images/landscape/landscape (57).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DUp_axzE2T6/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (57).webp",
          "assets/images/landscape/landscape (58).webp",
          "assets/images/landscape/landscape (59).webp",
          "assets/images/landscape/landscape (60).webp",
          "assets/images/landscape/landscape (61).webp",
          "assets/images/landscape/landscape (62).webp",
          "assets/images/landscape/landscape (63).webp",
          "assets/images/landscape/landscape (64).webp",
          "assets/images/landscape/landscape (65).webp",
          "assets/images/landscape/landscape (66).webp"
        ],
        description: "紅燈籠高掛與熙攘人潮，映照出舊城區最濃厚的煙火氣"
      },
      {
        id: "land-11",
        title: "黑夜裡的血脈",
        client: "National Highway",
        year: "2025",
        cover: "assets/images/landscape/landscape (67).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DN1kb2LBhkD/" }
        ],
        photos: [
          "assets/images/landscape/landscape (67).webp"
        ],
        description: "流動的光軌劃破靜謐夜空，串連起城市不曾停歇的呼吸"
      },
      {
        id: "land-10",
        title: "雲霧間的山脊線",
        client: "Keelung Mountain",
        year: "2025",
        cover: "assets/images/landscape/landscape (68).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DMFLMjKhfAW/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (68).webp"
        ],
        description: "順著石階直上峰頂，在蒼翠山海間尋找風的痕跡"
      },
      {
        id: "land-9",
        title: "燈火初上山城夜",
        client: "Jiufen",
        year: "2025",
        cover: "assets/images/landscape/landscape (69).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DLmSPiwhtVz/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (69).webp"
        ],
        description: "微光點亮紅燈籠，斜陽餘暉下的茶樓疊印出歲月的漫長"
      },
      {
        id: "land-8",
        title: "神木參道的日常",
        client: "Kengun Shrine",
        year: "2024",
        cover: "assets/images/landscape/landscape (70).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DKj9Eg5Bv9Z/" }
        ],
        photos: [
          "assets/images/landscape/landscape (70).webp"
        ],
        description: "綠意覆蓋古老社殿，獨自漫步於古道，感受寧靜肅穆的晨光時刻"
      },
      {
        id: "land-7",
        title: "溪谷間的綠色星河",
        client: "Jinping Creek",
        year: "2025",
        cover: "assets/images/landscape/landscape (71).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DLITEgpBBgD/" }
        ],
        photos: [
          "assets/images/landscape/landscape (71).webp"
        ],
        description: "夜幕低垂，點點螢光在清澈溪流與幽暗山林間穿梭飛舞"
      },
      {
        id: "land-6",
        title: "水墨層巒的遠眺",
        client: "Jianshi",
        year: "2025",
        cover: "assets/images/landscape/landscape (72).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DJtfuj9hZH6/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (72).webp",
          "assets/images/landscape/landscape (73).webp",
          "assets/images/landscape/landscape (74).webp",
          "assets/images/landscape/landscape (75).webp",
          "assets/images/landscape/landscape (76).webp"
        ],
        description: "黑白影調勾勒出山脊的粗獷，雲霧輕覆遠方連綿的稜線"
      },
      {
        id: "land-5",
        title: "太陽落下的軌跡",
        client: "Manhattanhenge",
        year: "2025",
        cover: "assets/images/landscape/landscape (77).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DJJlsShBbE_/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (77).webp"
        ],
        description: "金色烈陽沿著天際軌跡緩降，將整座樓房林立的城市染成溫暖金黃"
      },
      {
        id: "land-4",
        title: "枕海而生的日常",
        client: "Jinshan",
        year: "2025",
        cover: "assets/images/landscape/landscape (78).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DIqz6uLBAbj/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (78).webp",
          "assets/images/landscape/landscape (79).webp",
          "assets/images/landscape/landscape (80).webp",
          "assets/images/landscape/landscape (81).webp",
          "assets/images/landscape/landscape (82).webp"
        ],
        description: "海堤上的老檔車與釣客，刻劃出北海岸靠海吃海、隨遇而安的歲月風情"
      },
      {
        id: "land-3",
        title: "雲隙間的光芒與航線",
        client: "Sunset",
        year: "2025",
        cover: "assets/images/landscape/landscape (83).webp",
        position: "50% 50%",
        scale: 1.2,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DIQx_9GJcn_/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (83).webp"
        ],
        description: "夕暮雲層透出萬丈光芒，微小的飛機劃過天際，駛向夜幕低垂的遠方"
      },
      {
        id: "land-2",
        title: "旋轉的宇宙年輪",
        client: "Star Trails",
        year: "2025",
        cover: "assets/images/landscape/landscape (84).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DGsJRsOJGjf/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (84).webp",
        ],
        description: "時間在夜空下靜靜旋轉，於山脊上方烙印出星辰運行的軌跡"
      },
      {
        id: "land-1",
        title: "林間小徑的螢光微光",
        client: "Shiding",
        year: "2026",
        cover: "assets/images/landscape/landscape (85).webp",
        position: "50% 50%",
        scale: 1.0,
        links: [
          { label: "Instagram 貼文", url: "https://www.instagram.com/p/DW_f7LEGaPN/?img_index=1" }
        ],
        photos: [
          "assets/images/landscape/landscape (85).webp",
          "assets/images/landscape/landscape (86).webp"
        ],
        description: "漫步幽靜步道，看黃綠色的微光在樹林間點亮夜的微光"
      }
    ]
  },

  // ------------------------------------------------------------------
  // 📸 客戶私密交圖專區設定 (Private Client Delivery Gallery Config)
  // ------------------------------------------------------------------
  workerApiEndpoint: "https://weipic-api.weipic2023.workers.dev/",
  clientGalleries: []
};

