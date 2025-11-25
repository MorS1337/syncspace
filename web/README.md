# SyncSpace Web

Фронтенд для платформы SyncSpace, собранный на React + TypeScript + Vite.

## Быстрый старт

```bash
cd /Users/mors1337/Code/Projects/syncspace/web
npm install
npm run dev
```

По умолчанию dev-сервер поднимается на `http://localhost:5173` и проксирует все запросы с префиксом `/api` на `http://localhost:8000`, где должен работать FastAPI-бэкенд.

## Скрипты

- `npm run dev` — запуск Vite dev server.
- `npm run build` — сборка production-версии.
- `npm run preview` — предпросмотр собранного приложения.

## Архитектура

Ключевые директории расположены в `src/`:

- `api/` — адаптеры вызовов FastAPI.
- `components/` — UI-компоненты (Layout, Space, Page, Task).
- `hooks/` — обёртки вокруг React Query.
- `pages/` — страницы (Home, Space, NotFound).
- `types/` — типы, синхронизированные со схемами бэкенда.
- `utils/` — вспомогательные утилиты (например, Query Client).

React Query отвечает за кеш и мутации, Material UI — за визуальные компоненты, `@dnd-kit` обеспечивает drag-and-drop на доске задач, `react-markdown` + `remark-gfm` дают Markdown-редактор.

