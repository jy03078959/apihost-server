deploy-dev: install-dev restart-dev
fast-deploy-dev: sync-dev restart-dev
fast-watch-dev: fast-deploy-dev
	ssh root@192.168.199.131 "pm2 logs server-dev"


restart-dev:
	ssh root@192.168.199.131 "pm2 restart server-dev"

sync-dev:
	rsync -az --delete-after --force \
	  --filter="- node_modules" \
	  --filter="+ config/default*" \
	  --filter="- config/*" \
	  --filter="+ lib**" \
	  --filter="+ scripts**" \
	  --filter="+ app.js" \
	  --filter="- *" \
	  -e "ssh -p 22" \
	  ./ \
	  deploy@192.168.199.131:/project/server-dev

install-dev: sync-dev
	ssh deploy@192.168.199.131 "cd /projects/server-dev && npm install"

sync-release:
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
update-release:
	ssh root@192.168.199.131 "cd /home/deploy/server && npm install"
deploy-release: sync-release update-release

run:
	ssh root@192.168.199.131 "cd /home/deploy/server && pm2 start app.js"
dep-run:deploy-release
	ssh root@192.168.199.131 "cd /home/deploy/server && pm2 start app.js"
restart:
	ssh root@192.168.199.131 "pm2 restart app"
