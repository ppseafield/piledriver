#!/usr/bin/env bash

if [[ -z $PGRST_AUTHENTICATOR_PASSWORD ]]; then
    exit 1
else
    psql <<SETUPSQL
    	CREATE SCHEMA piledriver;
	CREATE ROLE web_anon NOLOGIN;
	GRANT USAGE ON SCHEMA piledriver TO web_anon;
	GRANT USAGE ON SCHEMA public TO web_anon;

	CREATE ROLE piledriver_user NOLOGIN;
	GRANT USAGE ON SCHEMA piledriver TO piledriver_user;
	GRANT USAGE ON SCHEMA public TO piledriver_user;

	CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD '${PGRST_AUTHENTICATOR_PASSWORD}';
	GRANT web_anon TO authenticator;
	GRANT piledriver_user TO authenticator;
SETUPSQL
fi
