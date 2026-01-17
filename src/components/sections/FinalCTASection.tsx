import { Heading } from '../atoms/Heading';
import { Button } from '../atoms/Button';

interface FinalCTASectionProps {
  onOpenForm: () => void;
}

export const FinalCTASection = ({ onOpenForm }: FinalCTASectionProps) => {
  return (
    <section className="px-6 py-20 bg-[#4A90E2] text-white text-center rounded-[40px]">
      <Heading level={2} className="mb-4">Готов начать карьеру?</Heading>
      <p className="text-blue-100 mb-10 text-lg">
        Присоединяйся к команде профессионалов Газпром Трансгаз Сургут. 
        Отправь заявку и мы свяжемся с тобой.
      </p>
      
      <Button variant="secondary" className="w-full" onClick={onOpenForm}>
        Отправить заявку
      </Button>
      
      <p className="mt-8 text-sm text-blue-200 opacity-60">
        © 2026 ООО «Газпром трансгаз Сургут»
      </p>
    </section>
  );
};
