ifeq ($(env),)
env := local
endif

ifeq ($(project_name),)
project_name := stonk-be-$(env)
endif

ifeq ($(seed),)
seed :=
endif

ifndef no_install
no_install =
endif

ifeq ($(STONK_API_NO_INSTALL), 1)
no_install := true
endif

ifndef containers
containers := api
endif

SEED=$(seed)
USER_ID=$(shell id -u)
COMPOSE_PROJECT_NAME=$(project_name)
NO_INSTALL=$(no_install)
export

# For tests, we want to use only one static file, with overrides
# for most things, especially networks and volumes
ifneq ($(env),test)
	compose_files = -f docker-compose.yml -f docker-compose.$(env).yml
	ifeq ($(secrets),)
		secrets = secrets.yml
	endif

	ifneq ("$(wildcard $(secrets))","")
		compose_files := $(compose_files) -f $(secrets)
	endif

	private_compose_file = docker-compose.private.yml

	ifneq ("$(wildcard $(private_compose_file))","")
		compose_files := $(compose_files) -f $(private_compose_file)
	endif
else
	compose_files = -f docker-compose.test.yml
endif

build:
	@docker-compose $(compose_files) build

run:
	@docker-compose $(compose_files) up

run-d:
	@docker-compose $(compose_files) up -d

test:
	@export CLEAN=$(clean) && ./api/test.sh $(args)

connect:
	@docker exec -it stonk-be-$(service)-$(env) ash

stop:
	@docker-compose stop

down:
	@docker-compose $(compose_files) down

# Only make it easy to remove volumes locally
# destroy:
# 	@docker-compose -f docker-compose.yml -f docker-compose.local.yml -p stonk-platform-be-local down -v

logs:
	@docker-compose $(compose_files) logs -f --tail=100 $(containers)

default: build
