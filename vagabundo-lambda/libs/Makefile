build-libs:
	mkdir -p $(ARTIFACTS_DIR)/python/libs/db
	mkdir -p $(ARTIFACTS_DIR)/python/libs/trips
	mkdir -p $(ARTIFACTS_DIR)/python/libs/stats

	cp *.py $(ARTIFACTS_DIR)/python/libs/
	cp -r db/ $(ARTIFACTS_DIR)/python/libs/
	cp -r trips/ $(ARTIFACTS_DIR)/python/libs/
	cp -r stats/ $(ARTIFACTS_DIR)/python/libs/
	cp requirements.txt $(ARTIFACTS_DIR)/python

	python -m pip install -r requirements.txt -t $(ARTIFACTS_DIR)/python
	rm -rf $(ARTIFACTS_DIR)/python/bin
