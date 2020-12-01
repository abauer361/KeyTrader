#!/bin/sh

# Builds for dev or prod based on env variable
if [ "${ENV}" = "PROD" ]; then
    # keeps the command running forever so that nginx won't error out
    # due to docker host not existing
    npm run build:prod && tail -f /dev/null
elif [ "${ENV}" = "TEST" ]; then
    npm run test
elif [ "${ENV}" = "E2E" ]; then
    npm run e2e
else
    # remove any left over prod build files
    # so that dev server will be used instead
    # (may need to also be ran for test and e2e)
    rm -r /client/dist/citf/*
    npm start
fi
