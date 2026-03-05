# headliner-carts

SPA для работы с корзинами пользователей на основе API [DummyJSON](https://dummyjson.com/docs/carts).

**[Ссылка на деплой](https://headliner-carts-2fshy1m4e-alexandr-leshkos-projects.vercel.app/)**

## Запуск

```bash
npm install
cp .env.example .env   # задать переменные окружения
npm run dev
```

Приложение откроется на `http://localhost:5173`.

### Переменные окружения

| Переменная | Описание | По умолчанию |
|---|---|---|
| `VITE_API_BASE_URL` | Базовый URL API | `https://dummyjson.com` |

Скопируйте `.env.example` → `.env` и при необходимости измените значения.

### Команды

| Команда | Описание |
|---|---|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка для production |
| `npm run preview` | Предпросмотр production-сборки |
| `npm run lint` | Проверка ESLint |
| `npm run test` | Запуск тестов (Vitest) |
| `npm run test:watch` | Тесты в watch-режиме |

---

## Архитектура

### Стек

- **React** + **Vite** — SPA
- **React Router** — маршрутизация
- **TypeScript** — типизация
- **@tanstack/react-query** — кэширование, prefetch, оптимистичные обновления
- **Zod** — runtime-валидация ответов API
- **@emotion/styled** — стилизация
- **@emotion/react** — ThemeProvider, темизация
- **Zustand** — глобальный стейт (пагинация, фильтры)
- **Axios** — HTTP-клиент
- **react-helmet-async** — управление `<head>` (title, meta)
- **Vitest** + **Testing Library** — юнит-тесты
- **Husky** + **lint-staged** + **commitlint** — pre-commit хуки, линтинг, конвенции коммитов
- **lucide-react** — иконки
- **vite-tsconfig-paths** — алиасы путей (`@api`, `@hooks`, `@components`, `@pages`, `@store`, `@theme`)

### Структура проекта

```
src/
├── api/           # Axios-клиент, Zod-схемы, типы, query keys, константы
├── components/
│   ├── ErrorBoundary/  # React Error Boundary (маршрутный + глобальный)
│   ├── Layout/         # Layout с Suspense и skip-link
│   └── ui/             # Button, Input, DropDown, Label, StatusState
├── hooks/         # useCart, useCarts, useUpdateCart, useCartActions, usePrefetchCart
├── pages/         # CartList, CartDetail, NotFound
├── store/         # Zustand: paginationStore (page, limit, userIdFilter)
├── test/          # Настройка Vitest, утилиты (createWrapper)
├── theme/         # Цвета, брейкпоинты, Emotion theme
├── queryClient.ts # Общий QueryClient
└── App.tsx        # Роутинг, провайдеры, code splitting
```

### Поток данных

1. **Список корзин** — `useCarts(limit, skip, userIdFilter)` → React Query + `keepPreviousData`
2. **Prefetch** — `usePrefetchCart` при hover/focus на карточку
3. **Детали корзины** — `useCart(id)` → GET `/carts/:id` с Zod-валидацией
4. **Редактирование** — `useCartActions` → оптимистичные обновления (`onMutate` / `onError` rollback)
5. **Пагинация и фильтры** — Zustand `paginationStore`; состояние сохраняется при навигации

### UI и паттерны

- **Тема** — ThemeProvider, семантические цвета (`theme.colors`), брейкпоинты
- **Адаптив** — CSS Grid с медиа-запросами (1/2/3 колонки)
- **StatusState** — переиспользуемый компонент для loading, error, empty
- **ErrorBoundary** — глобальный + маршрутный (автосброс при навигации)
- **Code splitting** — `React.lazy` + `Suspense` для страниц
- **Accessibility** — ARIA-атрибуты, skip-link, keyboard navigation в DropDown, `.sr-only`
- **Мемоизация** — `useMemo`, `useCallback`, `React.memo`
- **React Query** — `staleTime` 5 мин, `retry` 2, фабрика query keys

### Деплой

Сборка: `npm run build`. Статика в `dist/`