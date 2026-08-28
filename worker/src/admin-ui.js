export const ADMIN_HTML = `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>Weipic 相簿管理中心</title>
  <link rel="stylesheet" href="/admin/style.css">
</head>
<body>
  <main>
    <section id="login-view" class="login-shell">
      <form id="login-form" class="login-card">
        <div class="brand-mark">W</div>
        <p class="eyebrow">WEIPIC CLOUD</p>
        <h1>相簿管理中心</h1>
        <p class="muted">安全管理客戶下載相簿、密碼與 R2 照片清單。</p>
        <label>管理密碼<input id="admin-password" type="password" autocomplete="current-password" required autofocus></label>
        <button class="primary wide" type="submit">安全登入</button>
        <p id="login-error" class="error" role="alert"></p>
      </form>
    </section>

    <section id="app-view" class="app-shell hidden">
      <header class="topbar">
        <div><p class="eyebrow">WEIPIC CLOUD</p><h1>客戶相簿</h1></div>
        <div class="header-actions"><button id="change-password-btn" class="ghost">修改密碼</button><button id="refresh-btn" class="ghost">重新整理</button><button id="logout-btn" class="ghost danger-text">登出</button></div>
      </header>
      <div id="notice" class="notice hidden" role="status"></div>
      <section class="stats" aria-label="相簿統計">
        <article><span>全部相簿</span><strong id="stat-total">0</strong></article>
        <article><span>有效下載</span><strong id="stat-active">0</strong></article>
        <article><span>已到期／下架</span><strong id="stat-inactive">0</strong></article>
        <article><span>照片總數</span><strong id="stat-photos">0</strong></article>
      </section>
      <section class="toolbar">
        <input id="search-input" type="search" placeholder="搜尋客戶、相簿或 ID" aria-label="搜尋相簿">
        <button id="new-btn" class="primary">＋ 新增相簿</button>
      </section>
      <section id="gallery-list" class="gallery-list" aria-live="polite"></section>
      <div id="empty-state" class="empty hidden"><strong>找不到相簿</strong><span>請調整搜尋條件或新增第一個相簿。</span></div>
    </section>
  </main>

  <dialog id="editor-dialog">
    <form id="editor-form" method="dialog">
      <header class="dialog-header"><div><p class="eyebrow">GALLERY EDITOR</p><h2 id="editor-title">新增相簿</h2></div><button class="icon-btn" value="cancel" aria-label="關閉">×</button></header>
      <input id="original-id" type="hidden">
      <div class="form-grid">
        <label>相簿 ID <small>客戶網址使用，只能輸入英文、數字、-、_</small><input id="gallery-id" required pattern="[A-Za-z0-9][A-Za-z0-9_-]*" maxlength="100"></label>
        <label>客戶名稱<input id="client-name" maxlength="200"></label>
        <label>相簿名稱<input id="album-title" required maxlength="300"></label>
        <label>頁面標題<input id="page-title" maxlength="300"></label>
        <label>交件日期<input id="delivery-date" type="date"></label>
        <label>有效天數<input id="expiry-days" type="number" min="0" max="3650" step="1" value="14"></label>
        <label>ZIP 下載檔名<input id="zip-filename" maxlength="200"></label>
        <label>R2 資料夾 <small>例如 christmas/</small><input id="r2-prefix" required maxlength="500"></label>
      </div>
      <section class="password-box">
        <label>客戶下載密碼 <small id="password-help">新增時必填；編輯時留空可保留原密碼</small><input id="gallery-password" type="password" autocomplete="new-password"></label>
        <label class="check"><input id="generate-password" type="checkbox"> 儲存時自動產生安全密碼</label>
      </section>
      <label>照片清單 <small>每行一個檔名；可從 R2 自動讀取</small><textarea id="photos" rows="10" spellcheck="false"></textarea></label>
      <div class="r2-row"><button id="scan-r2-btn" type="button" class="secondary">從 R2 讀取照片</button><span id="photo-count">0 張照片</span></div>
      <label class="check status-check"><input id="is-deleted" type="checkbox"> 下架此相簿（客戶無法下載，但保留設定與 R2 原檔）</label>
      <p id="editor-error" class="error" role="alert"></p>
      <footer class="dialog-actions"><button type="button" id="cancel-editor" class="ghost">取消</button><button type="submit" class="primary">儲存到雲端</button></footer>
    </form>
  </dialog>

  <dialog id="password-dialog" class="small-dialog">
    <section><p class="eyebrow">PASSWORD CREATED</p><h2>請立即保存客戶密碼</h2><p class="muted">基於安全設計，關閉後無法再從系統讀回明碼。</p><div class="password-result"><code id="generated-password"></code><button id="copy-password" class="secondary">複製</button></div><button id="close-password" class="primary wide">我已保存</button></section>
  </dialog>

  <dialog id="backup-dialog" class="small-dialog">
    <section><div class="dialog-header"><div><p class="eyebrow">CLOUD BACKUPS</p><h2>最近備份</h2></div><button id="close-backups" class="icon-btn">×</button></div><div id="backup-list" class="backup-list"></div></section>
  </dialog>

  <dialog id="change-password-dialog" class="small-dialog">
    <form id="change-password-form" method="dialog">
      <header class="dialog-header"><div><p class="eyebrow">ADMIN SECURITY</p><h2>修改管理密碼</h2></div><button class="icon-btn" value="cancel" aria-label="關閉">×</button></header>
      <p class="muted">修改後舊密碼會失效。已登入裝置最長會在原本的 8 小時工作階段結束後登出。</p>
      <label>目前管理密碼<input id="current-admin-password" type="password" autocomplete="current-password" required></label>
      <label>新管理密碼 <small>至少 8 個字元，建議使用容易記得但不易猜到的片語</small><input id="new-admin-password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required></label>
      <label>再次輸入新密碼<input id="confirm-admin-password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required></label>
      <p id="change-password-error" class="error" role="alert"></p>
      <footer class="dialog-actions"><button type="button" id="cancel-change-password" class="ghost">取消</button><button type="submit" class="primary">確認修改</button></footer>
    </form>
  </dialog>
  <script src="/admin/app.js"></script>
</body>
</html>`;

export const ADMIN_STYLES = `
:root{color-scheme:dark;--bg:#080a0f;--panel:#11151d;--panel2:#171c26;--line:#252c39;--text:#f6f7fb;--muted:#929bad;--gold:#eabf66;--gold2:#ffd98e;--red:#ff6b72;--green:#61d69e;--shadow:0 24px 80px rgba(0,0,0,.45)}
*{box-sizing:border-box}html{min-height:100%;background:var(--bg)}body{margin:0;min-height:100vh;font-family:Inter,"Noto Sans TC",system-ui,-apple-system,sans-serif;color:var(--text);background:radial-gradient(circle at 15% 0,rgba(234,191,102,.12),transparent 30rem),var(--bg)}button,input,textarea{font:inherit}button{cursor:pointer}button:disabled{opacity:.5;cursor:wait}.hidden{display:none!important}.eyebrow{margin:0 0 .35rem;color:var(--gold);font-size:.7rem;font-weight:800;letter-spacing:.18em}.muted{color:var(--muted);line-height:1.6}.login-shell{min-height:100vh;display:grid;place-items:center;padding:1.25rem}.login-card{width:min(430px,100%);padding:2rem;border:1px solid var(--line);border-radius:24px;background:rgba(17,21,29,.92);box-shadow:var(--shadow);backdrop-filter:blur(20px)}.brand-mark{display:grid;place-items:center;width:52px;height:52px;margin-bottom:1.25rem;border-radius:16px;background:linear-gradient(135deg,var(--gold2),#a7792e);color:#17100a;font:800 1.45rem Georgia,serif}.login-card h1,.topbar h1,.dialog-header h2,.small-dialog h2{margin:.15rem 0}.login-card label{margin:1.5rem 0 1rem}.app-shell{width:min(1200px,calc(100% - 2rem));margin:auto;padding:2rem 0 4rem}.topbar,.toolbar,.dialog-header,.dialog-actions,.r2-row,.header-actions{display:flex;align-items:center;justify-content:space-between;gap:.75rem}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:.85rem;margin:1.5rem 0}.stats article{padding:1.1rem 1.2rem;border:1px solid var(--line);border-radius:16px;background:linear-gradient(145deg,rgba(23,28,38,.96),rgba(14,18,25,.96))}.stats span{display:block;color:var(--muted);font-size:.78rem}.stats strong{display:block;margin-top:.45rem;font-size:1.65rem}.toolbar{margin:1rem 0}.toolbar input{max-width:430px}.gallery-list{display:grid;gap:.85rem}.gallery-card{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(150px,.65fr) minmax(110px,.4fr) auto;align-items:center;gap:1rem;padding:1.15rem 1.25rem;border:1px solid var(--line);border-radius:18px;background:rgba(17,21,29,.92)}.gallery-card h3{margin:0 0 .25rem;font-size:1rem}.gallery-card p{margin:0;color:var(--muted);font-size:.8rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.meta{font-size:.8rem;color:var(--muted)}.meta strong{display:block;color:var(--text);font-size:.92rem;margin-bottom:.2rem}.badge{display:inline-flex;align-items:center;gap:.35rem;padding:.35rem .6rem;border-radius:999px;font-size:.72rem;font-weight:700;background:rgba(97,214,158,.12);color:var(--green)}.badge.inactive{background:rgba(255,107,114,.12);color:var(--red)}.card-actions{display:flex;gap:.45rem;flex-wrap:wrap;justify-content:flex-end}.notice{margin:1rem 0;padding:.85rem 1rem;border:1px solid rgba(97,214,158,.3);border-radius:12px;background:rgba(97,214,158,.1);color:#baf3d6}.notice.error-notice{border-color:rgba(255,107,114,.35);background:rgba(255,107,114,.1);color:#ffb4b8}.empty{padding:4rem 1rem;text-align:center;color:var(--muted)}.empty strong,.empty span{display:block;margin:.4rem}label{display:block;color:#dce1eb;font-size:.82rem;font-weight:650}label small{display:block;margin:.25rem 0 .45rem;color:var(--muted);font-weight:400}input,textarea{width:100%;margin-top:.45rem;padding:.78rem .85rem;color:var(--text);border:1px solid #303847;border-radius:11px;outline:none;background:#0b0e14;transition:.2s border-color,.2s box-shadow}input:focus,textarea:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(234,191,102,.12)}textarea{resize:vertical;line-height:1.5;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:.8rem}.primary,.secondary,.ghost,.icon-btn{border:0;border-radius:10px;padding:.72rem 1rem;font-weight:750}.primary{color:#1b1309;background:linear-gradient(135deg,var(--gold2),var(--gold))}.secondary{color:var(--gold2);border:1px solid rgba(234,191,102,.35);background:rgba(234,191,102,.08)}.ghost{color:#dce1eb;border:1px solid var(--line);background:transparent}.icon-btn{padding:.35rem .65rem;color:var(--muted);font-size:1.5rem;background:transparent}.danger-text{color:var(--red)}.wide{width:100%}.error{min-height:1.1rem;margin:.7rem 0 0;color:var(--red);font-size:.8rem}dialog{width:min(800px,calc(100% - 1.5rem));max-height:calc(100vh - 2rem);padding:0;color:var(--text);border:1px solid var(--line);border-radius:22px;background:var(--panel);box-shadow:var(--shadow)}dialog::backdrop{background:rgba(0,0,0,.74);backdrop-filter:blur(8px)}dialog form,dialog>section{padding:1.4rem}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1.3rem 0}.password-box{display:grid;grid-template-columns:1fr auto;align-items:end;gap:1rem;padding:1rem;margin-bottom:1rem;border:1px solid rgba(234,191,102,.2);border-radius:14px;background:rgba(234,191,102,.05)}.check{display:flex;align-items:center;gap:.6rem}.check input{width:auto;margin:0}.status-check{margin:1.1rem 0}.r2-row{margin-top:.65rem;color:var(--muted);font-size:.8rem}.dialog-actions{margin-top:1.2rem;padding-top:1rem;border-top:1px solid var(--line);justify-content:flex-end}.small-dialog{width:min(520px,calc(100% - 1.5rem))}.password-result{display:flex;align-items:center;gap:.65rem;margin:1.25rem 0}.password-result code{flex:1;padding:.85rem;overflow:auto;border:1px solid var(--line);border-radius:10px;background:#080a0f;color:var(--gold2)}.backup-list{display:grid;gap:.65rem;margin-top:1rem;max-height:55vh;overflow:auto}.backup-item{padding:.85rem;border:1px solid var(--line);border-radius:12px;background:var(--panel2)}.backup-item strong,.backup-item span{display:block}.backup-item span{margin-top:.3rem;color:var(--muted);font-size:.75rem}
@media(max-width:800px){.stats{grid-template-columns:1fr 1fr}.gallery-card{grid-template-columns:1fr auto}.gallery-card .meta{display:none}.form-grid{grid-template-columns:1fr}.password-box{grid-template-columns:1fr}.toolbar{align-items:stretch}.toolbar input{max-width:none}.card-actions{grid-column:1/-1;justify-content:flex-start}}
@media(max-width:520px){.app-shell{width:min(100% - 1rem,1200px);padding-top:1rem}.topbar{align-items:flex-start}.header-actions{gap:.35rem;flex-wrap:wrap;justify-content:flex-end}.header-actions .ghost{padding:.6rem .7rem;font-size:.75rem}.stats{gap:.5rem}.stats article{padding:.85rem}.toolbar{flex-direction:column}.gallery-card{padding:1rem}.dialog-actions{position:sticky;bottom:-1.4rem;margin-left:-1.4rem;margin-right:-1.4rem;padding:1rem 1.4rem;background:var(--panel)}dialog form{padding:1.1rem}}
`;

export const ADMIN_APP_JS = String.raw`
'use strict';
const state={galleries:[],editing:null};
const byId=id=>document.getElementById(id);
const loginView=byId('login-view'),appView=byId('app-view'),listEl=byId('gallery-list'),emptyEl=byId('empty-state');
const editor=byId('editor-dialog'),passwordDialog=byId('password-dialog'),backupDialog=byId('backup-dialog'),changePasswordDialog=byId('change-password-dialog');

async function api(path,options={}){
  const response=await fetch(path,{...options,headers:{'Content-Type':'application/json',...(options.headers||{})}});
  let data={};try{data=await response.json()}catch{}
  if(response.status===401&&path!=='/admin/api/login'&&path!=='/admin/api/password'){showLogin();throw new Error('管理登入已失效，請重新登入');}
  if(!response.ok)throw new Error(data.message||'雲端操作失敗');
  return data;
}
function showLogin(){loginView.classList.remove('hidden');appView.classList.add('hidden');byId('admin-password').focus();}
function showApp(){loginView.classList.add('hidden');appView.classList.remove('hidden');}
function notice(message,error=false){const el=byId('notice');el.textContent=message;el.classList.toggle('error-notice',error);el.classList.remove('hidden');clearTimeout(notice.timer);notice.timer=setTimeout(()=>el.classList.add('hidden'),6000);}
function escapeText(value){return String(value==null?'':value);}
function isInactive(g){if(g.isDeleted)return true;if(!g.deliveryDate)return false;const p=g.deliveryDate.split(/[.\/-]/).map(Number);if(p.length!==3)return false;return Date.now()>Date.UTC(p[0],p[1]-1,p[2])+Number(g.expiryDays||0)*86400000;}
function statusLabel(g){if(g.isDeleted)return '已下架';return isInactive(g)?'已到期':'有效下載';}
function clientUrl(id){return 'https://weipic.github.io/download/'+encodeURIComponent(id);}
function button(label,action,kind='ghost'){const el=document.createElement('button');el.type='button';el.className=kind;el.textContent=label;el.addEventListener('click',action);return el;}

function render(){
  const query=byId('search-input').value.trim().toLowerCase();
  const rows=state.galleries.filter(g=>[g.id,g.clientName,g.albumTitle].join(' ').toLowerCase().includes(query));
  listEl.replaceChildren();emptyEl.classList.toggle('hidden',rows.length!==0);
  rows.forEach(g=>{
    const card=document.createElement('article');card.className='gallery-card';
    const title=document.createElement('div');const h=document.createElement('h3');h.textContent=g.albumTitle||g.id;const p=document.createElement('p');p.textContent=(g.clientName||'未填客戶')+' · '+g.id;title.append(h,p);
    const date=document.createElement('div');date.className='meta';date.innerHTML='<strong></strong><span></span>';date.querySelector('strong').textContent=g.deliveryDate||'未設定日期';date.querySelector('span').textContent=String((g.photos||[]).length)+' 張照片';
    const status=document.createElement('div');const badge=document.createElement('span');badge.className='badge'+(isInactive(g)?' inactive':'');badge.textContent=statusLabel(g);status.append(badge);
    const actions=document.createElement('div');actions.className='card-actions';
    actions.append(button('編輯',()=>openEditor(g),'secondary'),button('複製網址',()=>copyText(clientUrl(g.id),'客戶網址已複製')),button('備份',()=>showBackups(g)),button('刪除',()=>removeGallery(g),'ghost danger-text'));
    card.append(title,date,status,actions);listEl.append(card);
  });
  byId('stat-total').textContent=state.galleries.length;
  byId('stat-active').textContent=state.galleries.filter(g=>!isInactive(g)).length;
  byId('stat-inactive').textContent=state.galleries.filter(isInactive).length;
  byId('stat-photos').textContent=state.galleries.reduce((n,g)=>n+(g.photos||[]).length,0);
}
async function load(){byId('refresh-btn').disabled=true;try{const data=await api('/admin/api/galleries');state.galleries=data.galleries||[];render();}catch(error){notice(error.message,true);}finally{byId('refresh-btn').disabled=false;}}
function today(){const d=new Date(),pad=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function dotToDate(value){return value?value.replace(/\./g,'-'):'';}
function lines(){return byId('photos').value.split(/\r?\n/).map(v=>v.trim()).filter(Boolean);}
function updatePhotoCount(){byId('photo-count').textContent=String(lines().length)+' 張照片';}
function openEditor(g=null){
  state.editing=g;byId('editor-title').textContent=g?'編輯相簿':'新增相簿';byId('original-id').value=g?g.id:'';byId('gallery-id').value=g?g.id:'';byId('client-name').value=g?g.clientName||'':'';byId('album-title').value=g?g.albumTitle||'':'';byId('page-title').value=g?g.pageTitle||'':'';byId('delivery-date').value=g?dotToDate(g.deliveryDate):today();byId('expiry-days').value=g?g.expiryDays??14:14;byId('zip-filename').value=g?g.zipFilename||'':'';byId('r2-prefix').value=g?g.prefix||'':'';byId('photos').value=g?(g.photos||[]).join('\n'):'';byId('gallery-password').value='';byId('generate-password').checked=false;byId('is-deleted').checked=g?g.isDeleted===true:false;byId('editor-error').textContent='';byId('password-help').textContent=g?'留空可保留原密碼':'請輸入密碼，或勾選自動產生';updatePhotoCount();editor.showModal();
}
function galleryPayload(){return{id:byId('gallery-id').value,clientName:byId('client-name').value,albumTitle:byId('album-title').value,pageTitle:byId('page-title').value,deliveryDate:byId('delivery-date').value,expiryDays:Number(byId('expiry-days').value),zipFilename:byId('zip-filename').value,prefix:byId('r2-prefix').value,photos:lines(),isDeleted:byId('is-deleted').checked};}
async function save(event){event.preventDefault();const submit=editor.querySelector('button[type="submit"]');submit.disabled=true;byId('editor-error').textContent='';try{const data=await api('/admin/api/galleries',{method:'POST',body:JSON.stringify({originalId:byId('original-id').value,gallery:galleryPayload(),password:byId('gallery-password').value,generatePassword:byId('generate-password').checked})});editor.close();await load();notice(data.message+'；KV 可能需要約 60 秒全球生效');if(data.generatedPassword){byId('generated-password').textContent=data.generatedPassword;passwordDialog.showModal();}}catch(error){byId('editor-error').textContent=error.message;}finally{submit.disabled=false;}}
async function scanR2(){const prefix=byId('r2-prefix').value.trim();if(!prefix){byId('editor-error').textContent='請先填寫 R2 資料夾';return;}const btn=byId('scan-r2-btn');btn.disabled=true;btn.textContent='讀取中…';try{const data=await api('/admin/api/r2?prefix='+encodeURIComponent(prefix));byId('r2-prefix').value=data.prefix;byId('photos').value=data.filenames.join('\n');updatePhotoCount();notice('已從 R2 讀取 '+data.filenames.length+' 個檔案');}catch(error){byId('editor-error').textContent=error.message;}finally{btn.disabled=false;btn.textContent='從 R2 讀取照片';}}
async function removeGallery(g){if(!confirm('確定刪除「'+g.albumTitle+'」的下載資訊？\n\n客戶將無法登入，但 R2 原始照片會保留，且系統會先建立備份。'))return;try{const data=await api('/admin/api/galleries/'+encodeURIComponent(g.id),{method:'DELETE'});await load();notice(data.message+'；KV 快取可能需要約 60 秒失效');}catch(error){notice(error.message,true);}}
async function showBackups(g){backupDialog.showModal();byId('backup-list').textContent='讀取中…';try{const data=await api('/admin/api/galleries/'+encodeURIComponent(g.id)+'/backups');const box=byId('backup-list');box.replaceChildren();if(!data.backups.length){box.textContent='目前沒有舊版本備份。';return;}data.backups.forEach(item=>{const row=document.createElement('article');row.className='backup-item';const strong=document.createElement('strong');strong.textContent=item.action==='delete'?'刪除前備份':'修改前備份';const span=document.createElement('span');span.textContent=new Date(item.savedAt).toLocaleString('zh-TW')+' · '+((item.gallery&&item.gallery.photos)||[]).length+' 張照片';row.append(strong,span);box.append(row);});}catch(error){byId('backup-list').textContent=error.message;}}
async function copyText(value,message){try{await navigator.clipboard.writeText(value);notice(message);}catch{prompt('請手動複製：',value);}}
function openChangePassword(){byId('change-password-form').reset();byId('change-password-error').textContent='';changePasswordDialog.showModal();byId('current-admin-password').focus();}
async function changePassword(event){event.preventDefault();const submit=event.currentTarget.querySelector('button[type="submit"]');submit.disabled=true;byId('change-password-error').textContent='';try{const data=await api('/admin/api/password',{method:'POST',body:JSON.stringify({currentPassword:byId('current-admin-password').value,newPassword:byId('new-admin-password').value,confirmPassword:byId('confirm-admin-password').value})});changePasswordDialog.close();notice(data.message);}catch(error){byId('change-password-error').textContent=error.message;}finally{submit.disabled=false;}}

byId('login-form').addEventListener('submit',async e=>{e.preventDefault();const button=e.currentTarget.querySelector('button');button.disabled=true;byId('login-error').textContent='';try{await api('/admin/api/login',{method:'POST',body:JSON.stringify({password:byId('admin-password').value})});byId('admin-password').value='';showApp();await load();}catch(error){byId('login-error').textContent=error.message;}finally{button.disabled=false;}});
byId('logout-btn').addEventListener('click',async()=>{try{await api('/admin/api/logout',{method:'POST',body:'{}'});}finally{showLogin();}});
byId('change-password-btn').addEventListener('click',openChangePassword);byId('change-password-form').addEventListener('submit',changePassword);byId('cancel-change-password').addEventListener('click',()=>changePasswordDialog.close());byId('refresh-btn').addEventListener('click',load);byId('new-btn').addEventListener('click',()=>openEditor());byId('search-input').addEventListener('input',render);byId('editor-form').addEventListener('submit',save);byId('cancel-editor').addEventListener('click',()=>editor.close());byId('scan-r2-btn').addEventListener('click',scanR2);byId('photos').addEventListener('input',updatePhotoCount);byId('close-password').addEventListener('click',()=>passwordDialog.close());byId('copy-password').addEventListener('click',()=>copyText(byId('generated-password').textContent,'客戶密碼已複製'));byId('close-backups').addEventListener('click',()=>backupDialog.close());
(async()=>{try{const session=await api('/admin/api/session');if(session.authenticated){showApp();await load();}else showLogin();}catch{showLogin();}})();
`;
