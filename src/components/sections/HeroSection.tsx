import { Button } from '../atoms/Button';
import { Heading } from '../atoms/Heading';
import gazpromLogo from '../../assets/logo_white.jpg';

interface HeroSectionProps {
  onScrollToForm: () => void;
}

export const HeroSection = ({ onScrollToForm }: HeroSectionProps) => {
  return (
    <section className="px-6 pt-12 pb-16 flex flex-col items-center text-center relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#7BB3E8] rounded-full blur-3xl opacity-20 -z-10" />
      <div className="absolute top-40 -left-10 w-32 h-32 bg-[#4A90E2] rounded-full blur-3xl opacity-10 -z-10" />

      <Heading level={1} className="mb-4 !text-3xl">
        Карьера <br />
        <span className="text-[#4A90E2]">в ООО «Газпром трансгаз Сургут»</span>
      </Heading>

      <p className="text-gray-600 text-lg mb-10 max-w-[260px]">
        Выбери свою профессию и начни карьеру в крупнейшей газотранспортной компании.
      </p>

      <div className="w-full max-w-[255px] aspect-square relative mb-12">
        <div className="absolute inset-0 bg-[#E8E8E8] rounded-[40px] rotate-6 scale-95" />
        <div className="absolute inset-0 bg-white shadow-xl rounded-[40px] flex items-center justify-center p-6">
          <img
            src={gazpromLogo}
            alt="Газпром трансгаз Сургут"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <Button className="w-full" onClick={onScrollToForm}>
        Хочу в ГАЗПРОМ
      </Button>
    </section>
  );
};

