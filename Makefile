测试环境
##上传代码到测试服务器
sync-dev:
	rsync -az -v -r --delete-after --force \
	  --filter="- node_modules" \
	  --filter="+ config**" \
	  --filter="+ lib**" \
	  --filter="+ scripts**" \
	  --filter="+ app.js" \
	  --filter="+ package.json" \
	  --filter="+ yarn.lock" \
	  --filter="- *" \
	  -e "ssh -p 22" \
	  ./ \
	  deploy@192.168.199.131:~/server
#安装依赖
install-dev: 
	ssh deploy@192.168.199.131 "cd ~/server && yarn install"
#启动服务
run-dev:
	ssh root@192.168.199.131 "cd /home/deploy/server && pm2 start app.js"
#重启服务
restart-dev:
	ssh root@192.168.199.131 "pm2 restart app"
#更新代码并重启服务
deploy-dev:sync-dev install-dev restart-dev
