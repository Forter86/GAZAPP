# Инструкция по деплою и тестированию в Telegram

## Вариант 1: Локальное тестирование с ngrok

### Шаг 1: Установите ngrok
1. Скачайте с https://ngrok.com/download
2. Зарегистрируйтесь и получите токен
3. Авторизуйтесь: `ngrok config add-authtoken YOUR_TOKEN`

### Шаг 2: Запустите приложение локально
```bash
# Терминал 1 - Фронтенд
npm run dev

# Терминал 2 - Бэкенд
npm run server
```

### Шаг 3: Запустите ngrok
```bash
# Терминал 3
ngrok http 5173
```

Скопируйте HTTPS URL (например: `https://abc123.ngrok.io`)

### Шаг 4: Обновите URL API в коде
В `src/App.tsx` измените:
```typescript
const API_URL = 'https://YOUR_NGROK_URL.ngrok.io/send-application';
```

Или создайте файл `.env`:
```
VITE_API_URL=https://YOUR_NGROK_URL.ngrok.io/send-application
```

### Шаг 5: Настройте бота в Telegram
1. Откройте @BotFather в Telegram
2. Отправьте `/mybots` и выберите вашего бота
3. Выберите "Bot Settings" → "Menu Button"
4. Выберите "Configure Menu Button"
5. Введите URL: `https://YOUR_NGROK_URL.ngrok.io`

## Вариант 2: Деплой на Vercel

### Шаг 1: Соберите приложение
```bash
npm run build
```

### Шаг 2: Задеплойте на Vercel
1. Установите Vercel CLI: `npm i -g vercel`
2. Запустите: `vercel`
3. Следуйте инструкциям

### Шаг 3: Настройте переменные окружения
В настройках проекта Vercel добавьте:
- `VITE_API_URL` - URL вашего бэкенда

### Шаг 4: Задеплойте бэкенд
Бэкенд нужно задеплоить отдельно (Railway, Render, Heroku и т.д.)

## Вариант 3: Деплой на свой сервер

### Шаг 1: Соберите приложение
```bash
npm run build
```

### Шаг 2: Загрузите файлы из `dist/` на сервер

### Шаг 3: Настройте nginx для статики и прокси для API

## Важно для бэкенда:
Бэкенд должен быть доступен по HTTPS. Используйте:
- Railway.app (бесплатно)
- Render.com (бесплатно)
- Heroku (платно)
- Или свой VPS с SSL сертификатом

