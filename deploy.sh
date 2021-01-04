#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# push to gh-pages branch
git init
git add -A
git commit -m 'deploy github pages'
git push -f git@github.com:jaames/flipnote-audio-tool.git master:gh-pages

cd -