
test:
	@./node_modules/.bin/mocha \
		--reporter spec \
		--timeout 20000

.PHONY: test
