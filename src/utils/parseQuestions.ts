export interface Question {
  question: string;
  answers: string[];
  correctIndex: number;
}

/**
 * Парсит вопросы из текстового файла
 * Формат: 
 * - Вопрос на одной строке (может начинаться с номера, заканчивается "?")
 * - Варианты ответов на следующих строках (могут начинаться с маркеров "•", "-")
 * - Правильный ответ помечен символом "\" в конце строки
 * 
 * Пример:
 * 59. Фамилия одного из генеральных директоров?
 * • Пушкин\
 * • Лермонтов
 * • Достоевский
 */
export const parseQuestions = (text: string): Question[] => {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const lines = text.split(/\r?\n/).map(line => line.trim());
  const questions: Question[] = [];
  let currentQuestion: string | null = null;
  let answers: string[] = [];
  let correctIndex = -1;

  // Функция для очистки строки от маркеров
  const cleanLine = (line: string): string => {
    return line
      .replace(/^[•\-\s]+/, '') // Убираем только маркеры •, - и пробелы в начале
      .replace(/^\d+\.\s*/, '') // Убираем номер с точкой типа "1. " или "50. "
      .replace(/\\+$/, '') // Убираем \ в конце
      .trim();
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Пропускаем пустые строки
    if (!line || line.length === 0) {
      continue;
    }

    // Если строка заканчивается на "\", это правильный ответ
    if (line.endsWith('\\')) {
      const answer = cleanLine(line);
      if (answer.length > 0 && currentQuestion) {
        answers.push(answer);
        correctIndex = answers.length - 1;
      }
    } 
    // Если строка содержит "?" или начинается с номера и точки, это новый вопрос
    else if (line.includes('?') || /^\d+\./.test(line)) {
      // Сохраняем предыдущий вопрос, если он есть
      if (currentQuestion && answers.length > 0 && correctIndex >= 0) {
        questions.push({
          question: currentQuestion.replace(/^\d+\.\s*/, '').trim(), // Убираем номер из вопроса
          answers: [...answers],
          correctIndex
        });
      }

      // Начинаем новый вопрос
      currentQuestion = line.replace(/^\d+\.\s*/, '').trim(); // Убираем номер, но сохраняем вопрос
      answers = [];
      correctIndex = -1;
    } 
    // Иначе это вариант ответа (если уже есть текущий вопрос)
    else if (currentQuestion && line.length > 0) {
      // Пропускаем строки, которые выглядят как комментарии или пояснения
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('верно!') || 
          lowerLine.includes('неверно!') ||
          lowerLine.includes('слово') ||
          lowerLine.includes('в том числе') ||
          lowerLine.includes('альтернативная версия') ||
          lowerLine.includes('большая часть') ||
          lowerLine.includes('жидкое углеводородное') ||
          lowerLine.includes('это событие') ||
          lowerLine.includes('ничего подобного') ||
          lowerLine.includes('потому что') ||
          lowerLine.includes('оказалось') ||
          lowerLine.includes('определяют') ||
          lowerLine.includes('используется') ||
          lowerLine.includes('бесцветными бывают') ||
          lowerLine.includes('это не первое упоминание') ||
          line.length > 200) {
        continue;
      }
      
      // Если в строке есть \ где-то внутри (не только в конце), это тоже правильный ответ
      if (line.includes('\\') && !line.endsWith('\\')) {
        const cleaned = cleanLine(line.replace(/\\/g, ''));
        if (cleaned.length > 0) {
          answers.push(cleaned);
          correctIndex = answers.length - 1;
        }
        continue;
      }
      
      const answer = cleanLine(line);
      if (answer.length > 0 && answer.length < 200) {
        answers.push(answer);
      }
    }
  }

  // Добавляем последний вопрос
  if (currentQuestion && answers.length > 0 && correctIndex >= 0) {
    questions.push({
      question: currentQuestion.replace(/^\d+\.\s*/, '').trim(),
      answers: [...answers],
      correctIndex
    });
  }

  return questions;
};
