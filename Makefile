DOCKER=docker
BUILD=$(DOCKER) build
RUN=$(DOCKER) run
PUSH=$(DOCKER) push

IMAGE_ID := $(shell docker image ls | grep custom-nginx | awk '{print $$3}')

DOCKER_ID=ren1007
APPLICATION_NAME=custom-nginx
TAG_VERSION=1.1



docker/build:
	$(BUILD) -t $(APPLICATION_NAME) .

docker/run:
	$(RUN) -p 8080:8080 $(APPLICATION_NAME)

docker/tag/change:
	docker tag $(IMAGE_ID) $(DOCKER_ID)/$(APPLICATION_NAME):$(TAG_VERSION)

docker/push:
	$(PUSH) $(DOCKER_ID)/$(APPLICATION_NAME):$(TAG_VERSION)



# Makefile config
#===============================================================
help:
	echo "Usage: make [task]\n\nTasks:"
	perl -nle 'printf("    \033[33m%-30s\033[0m %s\n",$$1,$$2) if /^([a-zA-Z0-9_\/-]*?):(?:.+?## )?(.*?)$$/' $(MAKEFILE_LIST)

.SILENT: help

.PHONY: $(shell egrep -o '^(\._)?[a-z_-]+:' $(MAKEFILE_LIST) | sed 's/://')
