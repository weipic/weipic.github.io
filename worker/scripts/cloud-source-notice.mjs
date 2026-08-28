console.error([
  '相簿設定已改由 Cloudflare 雲端管理中心維護。',
  '為避免過期的本機 JSON 覆蓋或刪除雲端相簿，這個同步指令已安全停用。',
  '請開啟：https://weipic-api.weipic2023.workers.dev/admin'
].join('\n'));
process.exitCode = 1;
