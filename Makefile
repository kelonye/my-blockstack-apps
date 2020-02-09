run:
	@npm run start

deploy:
	@git push heroku master

server:
	@node src/server.js

.PHONY: server deploy run
