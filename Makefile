
test:
	@./node_modules/.bin/mocha \
		--reporter spec \
		--timeout 30000

.PHONY: test
