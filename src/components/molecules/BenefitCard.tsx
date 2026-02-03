import { Card } from '../atoms/Card';

interface BenefitCardProps {
  number: string;
  title: string;
  description: string;
}

export const BenefitCard = ({ number, title, description }: BenefitCardProps) => {
  return (
    <Card className="flex flex-wrap gap-4 items-start border-l-4 border-[#4A90E2] rounded-l-2xl !rounded-[40px]">
      <div className="text-3xl font-black text-gray-400 select-none py-[30px]">
        {number}
      </div>
      <div>
        <h4 className="font-bold text-lg mb-1">{title}</h4>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      </div>
    </Card>
  );
};
