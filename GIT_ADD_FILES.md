# Как добавить только нужные файлы в Git

## Проблема
Папка больше 25 МБ, Git не позволяет загрузить все файлы целиком.

## Решение: Добавлять файлы по одному или группами

### Вариант 1: Добавить только файл с вопросами (самый простой)

```bash
# Добавить только файл с вопросами из public
git add public/voprosi.txt

# Или из src/assets (если нужен)
git add src/assets/voprosi.txt

# Закоммитить
git commit -m "Add quiz questions file"

# Запушить
git push
```

### Вариант 2: Добавить несколько конкретных файлов

```bash
# Добавить файл с вопросами
git add public/voprosi.txt

# Добавить конфигурационные файлы
git add vercel.json
git add package.json

# Добавить компоненты викторины
git add src/components/sections/QuizSection.tsx
git add src/utils/parseQuestions.ts
git add src/App.tsx

# Закоммитить все
git commit -m "Add quiz feature"

# Запушить
git push
```

### Вариант 3: Добавить все маленькие файлы, исключая большие

```bash
# Сначала добавьте в .gitignore большие файлы (уже сделано)
# Теперь добавьте все, кроме игнорируемых:

git add .
git commit -m "Add files excluding large media"
git push
```

### Вариант 4: Принудительно добавить конкретный файл (если он в .gitignore)

Если файл попал в `.gitignore`, но вам нужно его добавить:

```bash
# Принудительно добавить файл (даже если он в .gitignore)
git add -f public/voprosi.txt

# Или
git add --force public/voprosi.txt
```

## Проверка перед коммитом

Перед коммитом проверьте, что будет добавлено:

```bash
# Посмотреть статус
git status

# Посмотреть, что именно будет добавлено
git diff --cached

# Если нужно убрать файл из staging
git reset HEAD путь/к/файлу
```

## Для вашего случая (викторина)

Минимальный набор файлов для работы викторины:

```bash
# 1. Файл с вопросами (обязательно!)
git add public/voprosi.txt

# 2. Компоненты викторины
git add src/components/sections/QuizSection.tsx
git add src/components/sections/ApplicationForm.tsx
git add src/utils/parseQuestions.ts

# 3. Обновленный App.tsx
git add src/App.tsx

# 4. Конфигурация
git add vercel.json

# 5. Коммит и пуш
git commit -m "Add quiz feature with questions"
git push
```

## Исключение больших файлов

Если нужно добавить все, кроме больших файлов:

1. Убедитесь, что в `.gitignore` есть:
   ```
   *.mp4
   *.mov
   ```

2. Добавьте файлы:
   ```bash
   git add .
   git status  # Проверьте, что большие файлы не добавлены
   git commit -m "Add files"
   git push
   ```

## Если большой файл уже был добавлен в Git

Если вы случайно добавили большой файл:

```bash
# Удалить из Git (но оставить на диске)
git rm --cached public/gzp_video.mp4

# Добавить в .gitignore
echo "*.mp4" >> .gitignore

# Закоммитить изменения
git add .gitignore
git commit -m "Remove large video file from Git"
git push
```

## Рекомендации

1. **Для викторины достаточно:**
   - `public/voprosi.txt` - файл с вопросами
   - Компоненты викторины
   - Конфигурация Vercel

2. **Большие файлы (видео, изображения):**
   - Храните отдельно (например, на CDN)
   - Или используйте Git LFS (Large File Storage)
   - Или загружайте напрямую на Vercel через их интерфейс

3. **Проверка размера:**
   ```bash
   # Посмотреть размер файлов
   ls -lh public/
   ls -lh src/assets/
   ```
