# Make rules for building Docker images

ifndef .acs.docker.mk
.acs.docker.mk=1

version?=${git.tag}
registry?=ghcr.io/amrc-factoryplus
suffix?=

tag=${version}${suffix}
image=${registry}/${repo}:${tag}

build_args+=	--build-arg revision="${git.tag} (${git.sha})"
build_args+=	--build-arg tag="${tag}"

# `git rev-parse HEAD:directory` gives a SHA for the contents of that
# directory. In particular, it changes only when changes are made to
# that directory. This might be usable to only rebuild when the source
# has changed, or even to retag an existing image from the same
# source...

.PHONY: build push run

all: build push

build: git.prepare
	docker build -t "${image}" ${build_args} .

push:
	docker push "${image}"

run:
	docker run -ti --rm "${image}" /bin/sh

include ${mk}/acs.git.mk
include ${mk}/acs.k8s.mk

endif
