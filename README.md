# headliner-carts

SPA для работы с корзинами пользователей на основе API [DummyJSON](https://dummyjson.com/docs/carts).

**[Ссылка на деплой](https://headliner-carts-2fshy1m4e-alexandr-leshkos-projects.vercel.app/)**

## Запуск

```bash
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`.

### Другие команды

- `npm run build` — сборка для production
- `npm run preview` — предпросмотр production-сборки
- `npm run lint` — проверка ESLint

---

## Архитектура

### Стек

- **React 19** + **Vite 7** — SPA
- **React Router** — маршрутизация
- **TypeScript** — типизация
- **@tanstack/react-query** — кэширование и запросы к API
- **@emotion/styled** — стилизация
- **@emotion/react** — ThemeProvider, темизация
- **Zustand** — глобальный стейт (пагинация, фильтры)
- **Axios** — HTTP-клиент
- **vite-tsconfig-paths** — алиасы путей
- **Husky** + **lint-staged** + **commitlint** — pre-commit хуки, линтинг, конвенции коммитов
- **lucide-react** — иконки

### Структура проекта

```
src/
├── api/           # API-клиент, типы, query keys
├── components/    # Layout, UI-компоненты (Button, Input, DropDown, Label, StatusState)
├── hooks/         # useCart, useCarts, useUpdateCart
├── pages/         # CartList, CartDetail, NotFound
├── store/         # Zustand: paginationStore (page, limit, userIdFilter)
├── theme/         # Цвета, брейкпоинты, Emotion theme
└── App.tsx
```

### Поток данных

1. **Список корзин** — `useCarts(limit, skip, userIdFilter)` → React Query кэширует ответы
2. **Детали корзины** — `useCart(id)` → GET `/carts/:id`
3. **Редактирование** — `useUpdateCart(id).mutate()` → PUT `/carts/:id`; в `onSuccess` обновляется кэш и инвалидируются списки
4. **Пагинация и фильтры** — Zustand `paginationStore`; состояние сохраняется при навигации внутри SPA

### UI и паттерны

- **Тема** — ThemeProvider, семантические цвета (`theme.colors`), брейкпоинты
- **Адаптив** — CSS Grid с медиа-запросами (1/2/3 колонки)
- **StatusState** — переиспользуемый компонент для loading, error, empty
- **Мемоизация** — `useMemo`, `useCallback`, `React.memo` для списков и обработчиков
- **React Query** — `staleTime` 5 мин, фабрика query keys
- :Hover, :disabled, :focus — в styled-компонентах

### Деплой

Сборка: `npm run build`. Статика в `dist/`. Подходит для Vercel, Netlify, GitHub Pages.