# Родословная Князевых — GitHub + Vercel

## Что где лежит

- `index.html` — сайт. Загрузить в репозиторий GitHub вместо старого `index.html`.
- `api/tree.js` — серверная функция Vercel. Она читает и записывает `data.json` через GitHub API.
- `vercel.json` — настройки Vercel.
- `data.json` — файл с данными родословной. Его можно создать в GitHub вручную или дать функции создать при первом сохранении.

## 1. GitHub

Создайте репозиторий, например `rodoslovnaya-knyazevy`.

В корень репозитория загрузите:

- `index.html`
- папку `api/` с файлом `tree.js`
- `vercel.json`
- `data.json` (рекомендуется)

Для GitHub Pages сайт должен иметь `index.html` в источнике публикации.

## 2. GitHub token

GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.

Выберите:

- Repository access → Only select repositories → ваш репозиторий
- Repository permissions → Contents → Read and write

Создайте токен и скопируйте его. В HTML токен НЕ вставлять.

## 3. Vercel

Импортируйте этот GitHub-репозиторий в Vercel.

В Vercel → Project → Settings → Environment Variables создайте:

- `GITHUB_TOKEN` = ваш GitHub token
- `GITHUB_OWNER` = ваш логин GitHub
- `GITHUB_REPO` = имя репозитория
- `GITHUB_BRANCH` = `main`
- `ADMIN_PASSWORD` = придуманный пароль для кнопки «Сохранить»
- `DATA_PATH` = `data.json`
- `ALLOWED_ORIGIN` = адрес GitHub Pages, например `https://ВАШЛОГИН.github.io` или `*` на этапе проверки

После этого сделайте Redeploy.

## 4. Подключите HTML к Vercel

Откройте `index.html` и найдите:

`const API_URL="https://YOUR-VERCEL-PROJECT.vercel.app/api/tree";`

Замените на адрес вашей функции Vercel, например:

`const API_URL="https://rodoslovnaya-api.vercel.app/api/tree";`

Снова загрузите `index.html` в GitHub.

## 5. GitHub Pages

В репозитории откройте Settings → Pages.

Выберите Deploy from a branch → `main` → `/ (root)` → Save.

После публикации сайт будет доступен по адресу вида:

`https://ВАШЛОГИН.github.io/ИМЯ-РЕПОЗИТОРИЯ/`

## Важно

GitHub Pages сам по себе не умеет выполнять PHP/Python/Node на сервере. Поэтому запись в `data.json` выполняет Vercel-функция, а GitHub API делает коммит файла.

GitHub token хранится только в Vercel Environment Variables и не попадает в браузер.

Если репозиторий публичный, `data.json` тоже будет доступен публично. Для семейных данных лучше держать данные в отдельном приватном репозитории и дать токену доступ только к нему.
