import { useState, useEffect } from 'react';
import { X, ChevronLeft, CheckCircle2, Trophy, Star } from 'lucide-react';
import { Button } from '../atoms/Button';

interface QuizSectionProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
}

interface Question {
  question: string;
  answers: string[];
  correctIndex: number;
}

interface QuizResult {
  score: number;
  total: number;
  message: string;
}

const resultMessages: Record<number, string> = {
  0: 'Не расстраивайся! Попробуй еще раз и стань частью нашей команды!',
  1: 'Хорошее начало! Изучи информацию о компании и попробуй снова!',
  2: 'Неплохо! Ты на правильном пути к карьере в Газпроме!',
  3: 'Отлично! Ты почти готов стать частью команды!',
  4: 'Превосходно! Ты готов присоединиться к нам!',
  5: 'Идеально! Ты готов стать частью команды ООО «Газпром трансгаз Сургут»!'
};

export const QuizSection = ({ isOpen, onClose, questions }: QuizSectionProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  // Выбираем случайные 5 вопросов из списка при открытии викторины
  useEffect(() => {
    if (isOpen && questions.length > 0) {
      if (questions.length <= 5) {
        setSelectedQuestions(questions);
      } else {
        // Создаем копию массива и перемешиваем (Fisher-Yates shuffle)
        const shuffled = [...questions];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setSelectedQuestions(shuffled.slice(0, 5));
      }
    }
  }, [isOpen, questions]);

  useEffect(() => {
    if (!isOpen) {
      // Сброс состояния при закрытии
      setCurrentQuestionIndex(0);
      setSelectedAnswers([]);
      setShowResult(false);
      setResult(null);
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAnswers[currentQuestionIndex] === undefined) return;

    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Завершаем викторину
      calculateResult();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResult = () => {
    let score = 0;
    selectedQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctIndex) {
        score++;
      }
    });

    const total = selectedQuestions.length;
    const message = resultMessages[score] || resultMessages[0];

    setResult({ score, total, message });
    setShowResult(true);
  };

  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const isAnswerSelected = selectedAnswers[currentQuestionIndex] !== undefined;
  const isLastQuestion = currentQuestionIndex === selectedQuestions.length - 1;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-[40px] w-full max-w-md max-h-[90vh] overflow-y-auto relative flex flex-col min-h-[300px]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 px-6 py-4 flex items-center justify-between border-b border-gray-100">
          {!showResult && (
            <button
              onClick={currentQuestionIndex > 0 ? handlePrev : onClose}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          )}
          {showResult && <div className="w-10" />}

          <span className="font-semibold text-gray-800">
            {showResult ? 'Результат' : `Вопрос ${currentQuestionIndex + 1} из ${selectedQuestions.length}`}
          </span>

          {!showResult && (
            <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          )}
          {showResult && <div className="w-10" />}
        </div>

        <div className="p-6 pb-24 flex-1">
          {showResult && result ? (
            // Экран результатов
            <div className="flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
              <div className="mb-6">
                {result.score === result.total ? (
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                ) : result.score >= result.total * 0.8 ? (
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Star className="w-12 h-12 text-white" />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>

              <h3 className="text-3xl font-black text-gray-800 mb-4">
                {result.score}/{result.total}
              </h3>

              <p className="text-xl text-gray-700 mb-8 leading-relaxed px-4">
                {result.message}
              </p>

              <div className="w-full space-y-3">
                <Button onClick={onClose} variant="primary" className="w-full">
                  Отлично!
                </Button>
                <Button
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setSelectedAnswers([]);
                    setShowResult(false);
                    setResult(null);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Пройти еще раз
                </Button>
              </div>
            </div>
          ) : (
            // Экран вопроса
            <div className="space-y-6">
              {/* Прогресс бар */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#4A90E2] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / selectedQuestions.length) * 100}%` }}
                />
              </div>

              {/* Вопрос */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
                  {currentQuestion?.question}
                </h3>

                {/* Варианты ответов */}
                <div className="space-y-3">
                  {currentQuestion?.answers.map((answer, index) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === index;
                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-4 rounded-2xl text-left transition-all border-2 ${isSelected
                          ? 'bg-[#4A90E2] text-white border-[#4A90E2] shadow-lg shadow-blue-500/30'
                          : 'bg-white text-gray-800 border-gray-200 hover:border-[#4A90E2] hover:shadow-md'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/20' : 'bg-gray-100'
                            }`}>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="font-medium">{answer}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Кнопка далее */}
              <div className="pt-4">
                <Button
                  onClick={handleNext}
                  variant="primary"
                  className="w-full"
                  disabled={!isAnswerSelected}
                >
                  {isLastQuestion ? 'Завершить' : 'Далее'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
