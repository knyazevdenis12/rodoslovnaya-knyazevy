# Родословная Князевых — GitHub Pages + Vercel

## ВАЖНО: vercel.json больше НЕ НУЖЕН

Не загружайте старый `vercel.json`. Vercel автоматически определяет Node.js runtime для `api/tree.js`. Старый файл с `"runtime": "nodejs22.x"` вызывал ошибку `Function Runtimes must have a valid version`.

## Структура репозитория

```text
index.html
data.json
api/tree.js
```

## Переменные окружения Vercel

Создайте в Vercel → Project → Settings → Environment Variables:

- `GITHUB_TOKEN` — Fine-grained GitHub token с `Contents: Read and write` для нужного репозитория.
- `GITHUB_OWNER` — ваш логин GitHub.
- `GITHUB_REPO` — имя репозитория.
- `GITHUB_BRANCH` — обычно `main`.
- `DATA_PATH` — `data.json`.
- `ADMIN_PASSWORD` — ваш пароль для сохранения.
- `ALLOWED_ORIGIN` — домен GitHub Pages, например `https://ВАШ_ЛОГИН.github.io` (для первого теста можно временно поставить `*`).

После добавления переменных сделайте Redeploy.

## API

Функция находится в `api/tree.js` и доступна по адресу:

`https://ВАШ-ПРОЕКТ.vercel.app/api/tree`

В `index.html` замените `API_URL` на этот адрес.
