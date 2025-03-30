/**
PM2 COMMENTS:

pm2 ls
pm2 start dist/server.js --name=BOOKSAW
pm2 start "npm run strat:prod" --name=BOOKSAW
pm2 stop id (first step)
pm2 delete id (second step)
pm2 restart id
pm2 monit
pm2 kill
*/