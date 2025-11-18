# Техническое задание: Frontend для SyncSpace

> **Для команды:** Это ТЗ для разработки веб-интерфейса. Бэкенд уже готов, нужно только подключиться к API.

---

## 🎯 Цель

Создать веб-интерфейс для платформы командной работы на хакатонах. Пользователи должны иметь возможность:
- Создавать и присоединяться к рабочим пространствам (Spaces)
- Ведение заметок в формате Markdown
- Управление задачами (Kanban-доска)
- Просмотр дедлайнов

---

## 🛠 Технологии (рекомендуемые)

### Обязательно:
- **React 18+** с TypeScript
- **Vite** для сборки (быстрый и простой)
- **React Router** для навигации
- **Axios** или **fetch** для запросов к API

### UI библиотека (выберите одну):
- **Material-UI (MUI)** — много готовых компонентов, хорошо документирован
- **Chakra UI** — проще для новичков, современный дизайн
- **Ant Design** — много компонентов, но сложнее

### Для Markdown:
- **react-markdown** + **remark-gfm** (для GitHub Flavored Markdown)
- **react-syntax-highlighter** (подсветка кода в блоках)

### Для drag-and-drop (задачи):
- **@dnd-kit/core** + **@dnd-kit/sortable** (современная библиотека)

### State management:
- **React Query (TanStack Query)** — для работы с API (кеширование, обновления)
- Или просто **useState/useEffect** на первых порах

---

## 📁 Структура проекта

```
web/
├── src/
│   ├── components/          # Переиспользуемые компоненты
│   │   ├── Layout/         # Шапка, сайдбар, основной layout
│   │   ├── Space/          # Компоненты для работы со Spaces
│   │   ├── Page/           # Редактор Markdown страниц
│   │   ├── Task/           # Карточки задач, Kanban
│   │   └── common/         # Кнопки, инпуты, модалки
│   ├── pages/              # Страницы приложения
│   │   ├── HomePage.tsx    # Список Spaces
│   │   ├── SpacePage.tsx   # Внутри Space (табы: Pages, Tasks)
│   │   └── NotFoundPage.tsx
│   ├── hooks/              # Кастомные хуки
│   │   ├── useSpaces.ts    # Загрузка списка Spaces
│   │   ├── usePages.ts     # Работа со страницами
│   │   └── useTasks.ts     # Работа с задачами
│   ├── api/                # Клиент для API
│   │   ├── client.ts       # Настройка axios/fetch
│   │   ├── spaces.ts       # Эндпоинты для Spaces
│   │   ├── pages.ts        # Эндпоинты для Pages
│   │   └── tasks.ts        # Эндпоинты для Tasks
│   ├── types/              # TypeScript типы
│   │   └── index.ts        # Типы из API (SpaceOut, TaskOut и т.д.)
│   ├── App.tsx             # Главный компонент + роутинг
│   └── main.tsx            # Точка входа
├── public/                 # Статика
├── package.json
└── vite.config.ts
```

---

## 🔌 API Endpoints (бэкенд готов)

**Base URL:** `http://localhost:8000/api`

### Spaces (Рабочие пространства)

```typescript
// Создать Space
POST /spaces
Body: { title: string, description?: string }
Response: { id: number, title: string, description?: string, invite_code: string }

// Присоединиться по invite code
POST /spaces/join/{code}
Response: { id: number, title: string, ... }

// Получить Space по ID
GET /spaces/{space_id}
Response: { id: number, title: string, ... }
```

### Pages (Заметки в Markdown)

```typescript
// Список страниц в Space
GET /pages/by-space/{space_id}
Response: Array<{ id: number, space_id: number, title: string, md_content: string }>

// Создать страницу
POST /pages
Body: { space_id: number, title: string }
Response: { id: number, ... }

// Получить страницу
GET /pages/{page_id}
Response: { id: number, title: string, md_content: string, ... }

// Обновить содержимое страницы
PUT /pages/{page_id}
Body: { md_content: string }
Response: { id: number, ... }
```

### Tasks (Задачи)

```typescript
// Список задач в Space (можно фильтровать по status)
GET /tasks/by-space/{space_id}?status=todo|in_progress|done
Response: Array<{ id: number, title: string, status: string, priority: number, assignee_id?: number, due_at?: string, ... }>

// Создать задачу
POST /tasks
Body: { space_id: number, title: string, description?: string, due_at?: string, assignee_id?: number }
Response: { id: number, ... }

// Обновить задачу (статус, исполнитель, дедлайн, приоритет)
PATCH /tasks/{task_id}
Body: { status?: "todo"|"in_progress"|"done", assignee_id?: number, due_at?: string, priority?: number }
Response: { id: number, ... }
```

### Health check
```typescript
GET /health
Response: { status: "ok" }
```

---

## 📱 Страницы и функционал

### 1. Главная страница (`/`)

**Что показывать:**
- Список всех Spaces, в которых пользователь состоит
- Кнопка "Создать Space"
- Кнопка "Присоединиться по коду" (ввод invite code)

**Компоненты:**
- `SpaceCard` — карточка Space (название, описание, кнопка "Открыть")
- `CreateSpaceModal` — модалка для создания Space
- `JoinSpaceModal` — модалка для ввода invite code

---

### 2. Страница Space (`/space/:id`)

**Структура:**
- Верхняя панель: название Space, invite code (для копирования)
- Табы: "Заметки" | "Задачи" | "Дедлайны" (пока только первые два)

#### Вкладка "Заметки" (`/space/:id/pages`)

**Что показывать:**
- Список страниц слева (сайдбар)
- Редактор Markdown справа (split view)
- Кнопка "Создать страницу"

**Компоненты:**
- `PageList` — список страниц (клик → открыть в редакторе)
- `MarkdownEditor` — редактор с preview
  - Использовать `react-markdown` для рендеринга
  - Текстовое поле для редактирования (textarea или более продвинутый редактор)
  - Кнопка "Сохранить" (PUT запрос)

**Функционал:**
- Автосохранение каждые 3-5 секунд (опционально)
- Показывать индикатор "Сохраняется..." / "Сохранено"

#### Вкладка "Задачи" (`/space/:id/tasks`)

**Что показывать:**
- Kanban-доска с тремя колонками: "To Do" | "In Progress" | "Done"
- Кнопка "Создать задачу" (модалка)
- Фильтры (опционально): по исполнителю, по приоритету

**Компоненты:**
- `KanbanBoard` — доска с колонками
- `TaskCard` — карточка задачи
  - Название, описание
  - Исполнитель (если есть)
  - Дедлайн (если есть, подсветить красным если просрочен)
  - Приоритет (цветная метка)
- `CreateTaskModal` — форма создания задачи
- `EditTaskModal` — форма редактирования (или inline)

**Функционал:**
- Drag-and-drop между колонками (меняет статус задачи)
- Клик по задаче → открыть детали/редактирование
- Фильтрация по статусу (через query параметр API)

---

## 🎨 Дизайн (минимальные требования)

### Цветовая схема:
- Основной цвет: синий (#1976d2 или похожий)
- Фон: светлый (#f5f5f5)
- Текст: темно-серый (#333)
- Акцент для важного: красный/оранжевый

### Компоненты должны быть:
- Адаптивными (работать на мобильных)
- С понятными состояниями (hover, active, disabled)
- С индикаторами загрузки (spinner при запросах)
- С обработкой ошибок (показывать toast/alert при ошибках API)

---

## 📋 Задачи по приоритету

### Фаза 1: Базовая структура (1-2 дня)
- [ ] Настроить проект (Vite + React + TypeScript)
- [ ] Установить UI библиотеку
- [ ] Настроить роутинг (React Router)
- [ ] Создать базовый Layout (шапка, навигация)
- [ ] Подключиться к API (axios/fetch, проверить `/health`)

### Фаза 2: Spaces (1-2 дня)
- [ ] Главная страница со списком Spaces
- [ ] Модалка создания Space
- [ ] Модалка присоединения по invite code
- [ ] Переход в Space по клику

### Фаза 3: Pages/Заметки (2-3 дня)
- [ ] Список страниц в сайдбаре
- [ ] Markdown редактор с preview
- [ ] Создание новой страницы
- [ ] Сохранение изменений (PUT запрос)
- [ ] Рендеринг Markdown (заголовки, списки, код, ссылки)

### Фаза 4: Tasks/Задачи (2-3 дня)
- [ ] Kanban доска (3 колонки)
- [ ] Карточки задач
- [ ] Создание задачи (модалка)
- [ ] Drag-and-drop между колонками
- [ ] Редактирование задачи (статус, исполнитель, дедлайн)

### Фаза 5: Полировка (1-2 дня)
- [ ] Обработка ошибок (404, 403, сетевые ошибки)
- [ ] Индикаторы загрузки
- [ ] Адаптивность (мобильная версия)
- [ ] Пустые состояния ("Нет задач", "Нет страниц")

---

## 🔧 Полезные ссылки

### Документация:
- React: https://react.dev
- Vite: https://vitejs.dev
- React Router: https://reactrouter.com
- React Query: https://tanstack.com/query/latest
- react-markdown: https://github.com/remarkjs/react-markdown
- @dnd-kit: https://docs.dndkit.com

### UI библиотеки:
- MUI: https://mui.com
- Chakra UI: https://chakra-ui.com
- Ant Design: https://ant.design

---

## ⚠️ Важные замечания

1. **Авторизация:** Пока её нет. Бэкенд использует `user_id = 1` для всех запросов. Позже добавим реальную авторизацию.

2. **CORS:** Если фронт на другом порту (например, 5173), нужно будет настроить CORS на бэкенде. Пока можно тестировать через прокси в Vite.

3. **Ошибки API:** Всегда обрабатывайте ошибки:
   - 404 — "Не найдено"
   - 403 — "Нет доступа"
   - 400 — "Неверные данные"
   - 500 — "Ошибка сервера"

4. **Типы TypeScript:** Создайте типы на основе схем API (см. `api/app/schemas.py`). Это поможет избежать ошибок.

5. **Тестирование:** Запустите бэкенд (`docker compose up`), проверьте что API работает через Postman или браузер, затем подключайте фронт.

---

## 🚀 Быстрый старт

```bash
# В папке web/
npm create vite@latest . -- --template react-ts
npm install
npm install react-router-dom axios
npm install @mui/material @emotion/react @emotion/styled  # или другую UI библиотеку
npm install react-markdown remark-gfm
npm install @dnd-kit/core @dnd-kit/sortable

# Запуск
npm run dev
```

---

## 📞 Вопросы?

Если что-то непонятно — спрашивайте! Лучше уточнить, чем делать не то.

**Удачи! 🚀**

