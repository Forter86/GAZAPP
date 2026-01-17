import { Heading } from '../atoms/Heading';
import { Card } from '../atoms/Card';
import olenSTOLSticker from '../../assets/olenSTOL.webp';

export const RequirementsSection = () => {
  return (
    <section className="px-6 py-1 relative overflow-hidden">
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <Heading level={2} className="flex-1 mt-[80px]">Кого мы ищем?</Heading>
        <img src={olenSTOLSticker} alt="" className="w-48 h-48 object-contain drop-shadow-lg flex-shrink-0 scale-x-[-1]" />
      </div>
      
      <Card className="relative z-10">
        <ul className="space-y-6">
          <li className="flex items-start gap-4">
            <span className="bg-[#4A90E2] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1">1</span>
            <p className="text-[#1A1A1A]">Выпускники вузов и колледжей по техническим и экономическим специальностям</p>
          </li>
          <li className="flex items-start gap-4">
            <span className="bg-[#4A90E2] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1">2</span>
            <p className="text-[#1A1A1A]">Базовые знания в выбранной области деятельности</p>
          </li>
          <li className="flex items-start gap-4">
            <span className="bg-[#4A90E2] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1">3</span>
            <p className="text-[#1A1A1A]">Готовность к обучению и профессиональному развитию</p>
          </li>
          <li className="flex items-start gap-4">
            <span className="bg-[#4A90E2] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1">4</span>
            <p className="text-[#1A1A1A]">Ответственность и желание работать в стабильной компании</p>
          </li>
        </ul>
      </Card>
    </section>
  );
};
