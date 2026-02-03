import { Heading } from '../atoms/Heading';
import { Button } from '../atoms/Button';
import { Send } from 'lucide-react';

interface FinalCTASectionProps {
  onOpenForm: () => void;
  onOpenQuiz: () => void;
}

export const FinalCTASection = ({ onOpenForm, onOpenQuiz }: FinalCTASectionProps) => {
  return (
    <section className="px-6 py-20 bg-[#4A90E2] text-white text-center rounded-[40px]">
      <Heading level={2} className="mb-4">Готов начать карьеру?</Heading>
      <p className="text-blue-100 mb-10 text-lg">
        Присоединяйся к команде профессионалов ООО «Газпром трансгаз Сургут».
        Отправь заявку и мы свяжемся с тобой.
      </p>

      <div className="space-y-3 mb-8">
        <Button variant="secondary" className="w-full" onClick={onOpenForm}>
          Старт карьеры с нами
        </Button>

        <button
          onClick={onOpenQuiz}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-[20px] text-center font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] relative overflow-hidden group"
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
            <span>Викторина: Проверь свои знания</span>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
        </button>

        <Button
          variant="outline"
          className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 flex items-center justify-center gap-2"
          onClick={() => window.open('https://t.me/gazpromtransgazsurgut', '_blank')}
        >
          <Send className="w-4 h-4" />
          Мы в Telegram
        </Button>

        <Button
          variant="outline"
          className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 flex items-center justify-center gap-2"
          onClick={() => window.open('https://t.me/smus_gtsurgut', '_blank')}
        >
          <Send className="w-4 h-4" />
          Вступить в СМУС
        </Button>
      </div>

      <p className="mt-8 text-sm text-blue-200 opacity-60">
        © 2026 ООО «Газпром трансгаз Сургут»
      </p>
    </section>
  );
};
