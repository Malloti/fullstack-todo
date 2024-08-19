#!/usr/bin/env bash
# exit on error
set -o errexit

bundle check || bundle install
bundle exec rails assets:precompile
bundle exec rails assets:clean

bundle exec rails db:prepare

yarn check --check-files || yarn install