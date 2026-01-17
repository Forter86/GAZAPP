import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../atoms/Button';
import privacyPolicyPdf from '../../assets/Политика_обработки_персональных_данных_в_ООО_Газпром_трансгаз_Су.pdf';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

interface FormData {
  vacancy: string;
  fullName: string;
  age: string;
  workExperience: string;
  city: string;
  relocation: string;
  education: string;
  phone: string;
  email: string;
  additionalInfo: string;
}

const vacancies = [
  'Инженер-механик',
  'Инженер-строитель',
  'Инженер по подготовке кадров',
  'Специалист по кадрам',
  'Инженер по наладке и испытаниям',
  'Оператор технологических установок'
];

const workExperienceOptions = [
  'Около 1 года',
  'От 1-3 лет',
  'От 3-10 лет',
  'От 10-20 лет',
  'Не имеет опыта'
];

const relocationOptions = [
  'Готов к переезду',
  'Не готов к переезду',
  'Рассмотрю предложение'
];

const educationOptions = [
  '01 Начальное образование',
  '02 Основное общее образование',
  '03 Среднее (полное) общее образование',
  '04 Начальное профессиональное образование',
  '05 Среднее профессиональное образование',
  '06 Неполное высшее образование',
  '07 Высшее образование',
  '08 Послевузовское образование',
  '09 Ученая степень'
];

export const ApplicationForm = ({ isOpen, onClose, onSubmit }: ApplicationFormProps) => {
  const initialFormData: FormData = {
    vacancy: '',
    fullName: '',
    age: '',
    workExperience: '',
    city: '',
    relocation: '',
    education: '',
    phone: '',
    email: '',
    additionalInfo: ''
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentError, setConsentError] = useState('');

  // Сброс формы при закрытии
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
      setErrors({});
      setConsentGiven(false);
      setConsentError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.vacancy) newErrors.vacancy = 'Выберите вакансию';
    if (!formData.fullName.trim()) newErrors.fullName = 'Введите ФИО';
    if (!formData.age) newErrors.age = 'Введите возраст';
    if (isNaN(Number(formData.age)) || Number(formData.age) < 16 || Number(formData.age) > 100) {
      newErrors.age = 'Введите корректный возраст';
    }
    if (!formData.workExperience) newErrors.workExperience = 'Выберите опыт работы';
    if (!formData.city.trim()) newErrors.city = 'Введите город';
    if (!formData.relocation) newErrors.relocation = 'Выберите готовность к переезду';
    if (!formData.education) newErrors.education = 'Выберите образование';
    if (!formData.phone.trim()) newErrors.phone = 'Введите телефон';
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!consentGiven) {
      setConsentError('Необходимо дать согласие на обработку персональных данных');
    } else {
      setConsentError('');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && consentGiven;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setConsentGiven(false);
    setConsentError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        await onSubmit(formData);
        // Сброс формы после успешной отправки
        resetForm();
      } catch (error) {
        // Ошибка уже обработана в App.tsx
        console.error('Form submission error:', error);
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Закрываем форму только если клик был по фону, а не по контейнеру формы
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-[40px] w-full max-w-md max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="p-6 pt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Анкета соискателя</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Вакансия */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Вакансия <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.vacancy}
                onChange={(e) => handleChange('vacancy', e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border-2 ${
                  errors.vacancy ? 'border-red-500' : 'border-gray-200'
                } focus:border-[#4A90E2] focus:outline-none`}
              >
                <option value="">Выберите вакансию</option>
                {vacancies.map((vac) => (
                  <option key={vac} value={vac}>{vac}</option>
                ))}
              </select>
              {errors.vacancy && <p className="text-red-500 text-sm mt-1">{errors.vacancy}</p>}
            </div>

            {/* ФИО */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фамилия Имя Отчество <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border-2 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-200'
                } focus:border-[#4A90E2] focus:outline-none`}
                placeholder="Иванов Иван Иванович"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* Возраст */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Возраст <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border-2 ${
                  errors.age ? 'border-red-500' : 'border-gray-200'
                } focus:border-[#4A90E2] focus:outline-none`}
                placeholder="25"
                min="16"
                max="100"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>

            {/* Опыт работы */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Опыт работы по профессии <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.workExperience}
                onChange={(e) => handleChange('workExperience', e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border-2 ${
                  errors.workExperience ? 'border-red-500' : 'border-gray-200'
                } focus:border-[#4A90E2] focus:outline-none`}
              >
                <option value="">Выберите опыт</option>
                {workExperienceOptions.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
              {errors.workExperience && <p className="text-red-500 text-sm mt-1">{errors.workExperience}</p>}
            </div>

            {/* Город */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Город места жительства <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border-2 ${
                  errors.city ? 'border-red-500' : 'border-gray-200'
                } focus:border-[#4A90E2] focus:outline-none`}
                placeholder="Сургут"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>

            {/* Готовность к переезду */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Готовность к переезду <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.relocation}
                onChange={(e) => handleChange('relocation', e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border-2 ${
                  errors.relocation ? 'border-red-500' : 'border-gray-200'
                } focus:border-[#4A90E2] focus:outline-none`}
              >
                <option value="">Выберите вариант</option>
                {relocationOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.relocation && <p className="text-red-500 text-sm mt-1">{errors.relocation}</p>}
            </div>

            {/* Образование */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Образование <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.education}
                onChange={(e) => handleChange('education', e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border-2 ${
                  errors.education ? 'border-red-500' : 'border-gray-200'
                } focus:border-[#4A90E2] focus:outline-none`}
              >
                <option value="">Выберите образование</option>
                {educationOptions.map((edu) => (
                  <option key={edu} value={edu}>{edu}</option>
                ))}
              </select>
              {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
            </div>

            {/* Телефон */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Контактный телефон <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border-2 ${
                  errors.phone ? 'border-red-500' : 'border-gray-200'
                } focus:border-[#4A90E2] focus:outline-none`}
                placeholder="+7 (999) 123-45-67"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                EMAIL <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border-2 ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                } focus:border-[#4A90E2] focus:outline-none`}
                placeholder="ivan.ivanov@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Дополнительная информация */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дополнительная информация
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => handleChange('additionalInfo', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#4A90E2] focus:outline-none resize-none"
                placeholder="Дополнительная информация о себе..."
              />
            </div>

            {/* Согласие на обработку персональных данных */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => {
                    setConsentGiven(e.target.checked);
                    if (consentError) setConsentError('');
                  }}
                  className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2] cursor-pointer"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  Даю согласие на{' '}
                  <a
                    href={privacyPolicyPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4A90E2] underline hover:text-[#3a7bc8] font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    обработку персональных данных
                  </a>
                </span>
              </label>
              {consentError && <p className="text-red-500 text-sm mt-1 ml-8">{consentError}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
              >
                Отправить заявку
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

