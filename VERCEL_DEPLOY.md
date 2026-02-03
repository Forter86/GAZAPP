# Инструкция по деплою на Vercel

## Подготовка к деплою

1. **Убедитесь, что файл с вопросами на месте:**
   - Файл `public/voprosi.txt` должен быть в репозитории
   - Файл `src/assets/voprosi.txt` (опционально, для разработки)

2. **Проверьте конфигурацию:**
   - `vercel.json` настроен правильно
   - `package.json` содержит команду `build`

## Деплой на Vercel

### Вариант 1: Через GitHub (рекомендуется)

1. Закоммитьте и запушьте код в GitHub:
   ```bash
   git add .
   git commit -m "Add quiz feature with questions file"
   git push origin main
   ```

2. Подключите репозиторий к Vercel:
   - Зайдите на [vercel.com](https://vercel.com)
   - Нажмите "New Project"
   - Выберите ваш репозиторий
   - Vercel автоматически определит настройки из `vercel.json`

3. Настройки проекта:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build` (уже в vercel.json)
   - **Output Directory:** `dist` (уже в vercel.json)
   - **Install Command:** `npm install`

4. Деплой:
   - Нажмите "Deploy"
   - Vercel автоматически соберет и задеплоит проект

### Вариант 2: Через Vercel CLI

1. Установите Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Войдите в Vercel:
   ```bash
   vercel login
   ```

3. Задеплойте:
   ```bash
   vercel
   ```

4. Для продакшн деплоя:
   ```bash
   vercel --prod
   ```

## Проверка работы

После деплоя проверьте:

1. **Доступность файла с вопросами:**
   - Откройте `https://ваш-домен.vercel.app/voprosi.txt`
   - Должен отображаться текст с вопросами

2. **Работа викторины:**
   - Откройте приложение
   - Нажмите "ПОДАТЬ ЗАЯВКУ"
   - Выберите "Викторина"
   - Проверьте, что вопросы загружаются

## Отладка

Если файл не загружается:

1. Проверьте консоль браузера (F12) на наличие ошибок
2. Убедитесь, что файл `public/voprosi.txt` есть в репозитории
3. Проверьте, что файл скопировался в `dist/voprosi.txt` после сборки
4. Проверьте Network tab в DevTools - должен быть запрос к `/voprosi.txt`

## Обновление вопросов

Чтобы обновить вопросы:

1. Отредактируйте `public/voprosi.txt`
2. Закоммитьте изменения:
   ```bash
   git add public/voprosi.txt
   git commit -m "Update quiz questions"
   git push
   ```
3. Vercel автоматически пересоберет проект

## Структура файлов для Git

Убедитесь, что эти файлы в репозитории:
- ✅ `public/voprosi.txt` - файл с вопросами
- ✅ `vercel.json` - конфигурация Vercel
- ✅ `src/components/sections/QuizSection.tsx` - компонент викторины
- ✅ `src/utils/parseQuestions.ts` - парсер вопросов

Файлы, которые НЕ должны быть в Git:
- ❌ `node_modules/`
- ❌ `dist/`
- ❌ `.env` (если есть секретные данные)
