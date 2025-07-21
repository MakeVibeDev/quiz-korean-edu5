#!/usr/bin/env sh

# 에러 발생 시 중단
set -e

# 빌드
npm run build

# 빌드 디렉토리로 이동
cd dist

# 커스텀 도메인을 사용하는 경우 (선택사항)
# echo 'www.example.com' > CNAME

git init
git checkout -B main
git add -A
git commit -m 'deploy'

# GitHub Pages로 배포
# https://github.com/<USERNAME>/<REPO> 형식으로 변경하세요
# git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages

cd -