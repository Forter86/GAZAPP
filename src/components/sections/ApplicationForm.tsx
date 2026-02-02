import { useState, useEffect } from 'react';
import { X, ChevronLeft, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../atoms/Button';
import privacyPolicyPdf from '../../assets/Политика_обработки_персональных_данных_в_ООО_Газпром_трансгаз_Су.pdf';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  submitStatus?: 'idle' | 'success' | 'error';
  errorMessage?: string;
}

type FormType = 'employment' | 'internship';
type ViewState = 'choice' | FormType | 'quiz';

const vacancies = [
  'Инженер-механик',
  'Инженер-строитель',
  'Инженер по подготовке кадров',
  'Специалист по кадрам',
  'Инженер по наладке и испытаниям',
  'Оператор технологических установок'
];

const workExperienceOptions = ['Около 1 года', 'От 1-3 лет', 'От 3-10 лет', 'От 10-20 лет', 'Не имеет опыта'];
const relocationOptions = ['Готов к переезду', 'Не готов к переезду', 'Рассмотрю предложение'];
const educationOptions = [
  '01 Начальное образование', '02 Основное общее образование', '03 Среднее (полное) общее образование',
  '04 Начальное профессиональное образование', '05 Среднее профессиональное образование',
  '06 Неполное высшее образование', '07 Высшее образование', '08 Послевузовское образование', '09 Ученая степень'
];

const regions = ['ХМАО', 'ЯНАО', 'Тюменская область'];
const educationTypes = ['СПО (Среднее профессиональное)', 'ВУЗ (Высшее образование)'];
const branches = ['Сургутский филиал', 'Новоуренгойский филиал', 'Тюменский филиал', 'Краснодарский филиал'];

export const ApplicationForm = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  submitStatus = 'idle',
  errorMessage = ''
}: ApplicationFormProps) => {
  const [view, setView] = useState<ViewState>('choice');

  const [employmentData, setEmploymentData] = useState({
    vacancy: '', fullName: '', age: '', workExperience: '', city: '',
    relocation: '', education: '', phone: '', email: '', additionalInfo: ''
  });

  const [internshipData, setInternshipData] = useState({
    region: '', fullName: '', email: '', educationType: '', institution: '',
    specialization: '', branch: '', phone: '', additionalInfo: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentError, setConsentError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setView('choice');
      setErrors({});
      setConsentGiven(false);
      setConsentError('');
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateEmployment = () => {
    const newErrors: Record<string, string> = {};
    if (!employmentData.vacancy) newErrors.vacancy = 'Выберите вакансию';
    if (!employmentData.fullName.trim()) newErrors.fullName = 'Введите ФИО';
    if (!employmentData.age) newErrors.age = 'Введите возраст';
    if (!employmentData.workExperience) newErrors.workExperience = 'Выберите опыт';
    if (!employmentData.city.trim()) newErrors.city = 'Введите город';
    if (!employmentData.relocation) newErrors.relocation = 'Выберите готовность';
    if (!employmentData.education) newErrors.education = 'Выберите образование';
    if (!employmentData.phone.trim()) newErrors.phone = 'Введите телефон';
    if (!employmentData.email.trim()) newErrors.email = 'Введите email';
    else if (!validateEmail(employmentData.email)) newErrors.email = 'Некорректный email';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateInternship = () => {
    const newErrors: Record<string, string> = {};
    if (!internshipData.region) newErrors.region = 'Выберите регион';
    if (!internshipData.fullName.trim()) newErrors.fullName = 'Введите ФИО';
    if (!internshipData.email.trim()) newErrors.email = 'Введите email';
    else if (!validateEmail(internshipData.email)) newErrors.email = 'Некорректный email';
    if (!internshipData.educationType) newErrors.educationType = 'Выберите тип образования';
    if (!internshipData.institution.trim()) newErrors.institution = 'Укажите учебное заведение';
    if (!internshipData.specialization.trim()) newErrors.specialization = 'Укажите направление';
    if (!internshipData.branch) newErrors.branch = 'Выберите филиал';
    if (!internshipData.phone.trim()) newErrors.phone = 'Введите телефон';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) {
      setConsentError('Необходимо согласие');
      return;
    }
    setConsentError('');

    let isValid = false;
    let dataToSend = {};

    if (view === 'employment') {
      isValid = validateEmployment();
      dataToSend = { type: 'employment', ...employmentData };
    } else if (view === 'internship') {
      isValid = validateInternship();
      dataToSend = { type: 'internship', ...internshipData };
    }

    if (isValid) {
      onSubmit(dataToSend);
    }
  };

  const renderStatus = () => {
    if (isSubmitting) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
          <Loader2 className="w-16 h-16 text-[#4A90E2] animate-spin mb-6" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Отправка заявки...</h3>
          <p className="text-gray-500">Пожалуйста, подождите</p>
        </div>
      );
    }

    if (submitStatus === 'success') {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Успешно!</h3>
          <p className="text-gray-600 mb-8 text-lg">Заявка отправлена. Мы свяжемся с вами в ближайшее время!</p>
          <Button onClick={onClose} variant="primary" className="w-full">Отлично</Button>
        </div>
      );
    }

    if (submitStatus === 'error') {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Ошибка</h3>
          <p className="text-gray-600 mb-2">{errorMessage || 'Что-то пошло не так'}</p>
          <p className="text-red-500 text-sm font-medium mb-8 italic">Временные неполадки. Попробуйте еще раз позже.</p>
          <Button onClick={() => setView('choice')} variant="outline" className="w-full">Вернуться к выбору</Button>
        </div>
      );
    }

    return null;
  };

  const renderChoice = () => (
    <div className="flex flex-col gap-6 items-center justify-center h-full pt-10">
      <h2 className="text-2xl font-bold text-center mb-4">
        Выбирай свой путь в <br />
        <span className="text-[#4A90E2] drop-shadow-sm">ООО «Газпром трансгаз Сургут»</span>
      </h2>

      <div className="w-full space-y-4">
        <button
          onClick={() => setView('employment')}
          className="w-full bg-[#4A90E2] text-white p-6 rounded-[24px] text-left hover:bg-[#357ABD] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-1">Трудоустройство</h3>
            <p className="text-blue-100 text-sm opacity-90">Для опытных специалистов</p>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform" />
        </button>

        <button
          onClick={() => setView('internship')}
          className="w-full bg-white text-[#1A1A1A] p-6 rounded-[24px] text-left border-2 border-gray-100 hover:border-[#4A90E2] transition-all shadow-md hover:shadow-lg hover:-translate-y-1 relative overflow-hidden group"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-1">Практика</h3>
            <p className="text-gray-500 text-sm">Для студентов вузов и ссузов</p>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#4A90E2]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#4A90E2]/10 transition-colors" />
        </button>

      </div>
    </div>
  );

  const renderEmploymentForm = () => (
    <div className="space-y-4">
      <div>
        <label className="label">Вакансия <span className="text-red-500">*</span></label>
        <select
          disabled={isSubmitting}
          value={employmentData.vacancy}
          onChange={(e) => setEmploymentData({ ...employmentData, vacancy: e.target.value })}
          className={`input-field ${errors.vacancy ? 'border-red-500' : ''}`}
        >
          <option value="">Выберите вакансию</option>
          {vacancies.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        {errors.vacancy && <p className="error-text">{errors.vacancy}</p>}
      </div>
      <div>
        <label className="label">ФИО <span className="text-red-500">*</span></label>
        <input
          disabled={isSubmitting}
          type="text"
          value={employmentData.fullName}
          onChange={(e) => setEmploymentData({ ...employmentData, fullName: e.target.value })}
          className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
          placeholder="Иванов Иван Иванович"
        />
        {errors.fullName && <p className="error-text">{errors.fullName}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Возраст <span className="text-red-500">*</span></label>
          <input disabled={isSubmitting} type="number" value={employmentData.age} onChange={(e) => setEmploymentData({ ...employmentData, age: e.target.value })} className="input-field" />
          {errors.age && <p className="error-text">{errors.age}</p>}
        </div>
        <div>
          <label className="label">Телефон <span className="text-red-500">*</span></label>
          <input disabled={isSubmitting} type="tel" value={employmentData.phone} onChange={(e) => setEmploymentData({ ...employmentData, phone: e.target.value })} className="input-field" />
          {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>
      </div>
      <div>
        <label className="label">Email <span className="text-red-500">*</span></label>
        <input disabled={isSubmitting} type="email" value={employmentData.email} onChange={(e) => setEmploymentData({ ...employmentData, email: e.target.value })} className="input-field" />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>
      <div>
        <label className="label">Опыт работы</label>
        <select disabled={isSubmitting} value={employmentData.workExperience} onChange={(e) => setEmploymentData({ ...employmentData, workExperience: e.target.value })} className="input-field">
          <option value="">Выберите опыт</option>
          {workExperienceOptions.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {errors.workExperience && <p className="error-text">{errors.workExperience}</p>}
      </div>
      <div>
        <label className="label">Город</label>
        <input disabled={isSubmitting} type="text" value={employmentData.city} onChange={(e) => setEmploymentData({ ...employmentData, city: e.target.value })} className="input-field" />
        {errors.city && <p className="error-text">{errors.city}</p>}
      </div>
      <div>
        <label className="label">Переезд</label>
        <select disabled={isSubmitting} value={employmentData.relocation} onChange={(e) => setEmploymentData({ ...employmentData, relocation: e.target.value })} className="input-field">
          <option value="">Выберите вариант</option>
          {relocationOptions.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {errors.relocation && <p className="error-text">{errors.relocation}</p>}
      </div>
      <div>
        <label className="label">Образование</label>
        <select disabled={isSubmitting} value={employmentData.education} onChange={(e) => setEmploymentData({ ...employmentData, education: e.target.value })} className="input-field">
          <option value="">Выберите образование</option>
          {educationOptions.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {errors.education && <p className="error-text">{errors.education}</p>}
      </div>
      <div>
        <label className="label">Доп. инфо</label>
        <textarea disabled={isSubmitting} value={employmentData.additionalInfo} onChange={(e) => setEmploymentData({ ...employmentData, additionalInfo: e.target.value })} className="input-field min-h-[80px]" />
      </div>
    </div>
  );

  const renderInternshipForm = () => (
    <div className="space-y-4">
      <div>
        <label className="label">Регион (филиал) <span className="text-red-500">*</span></label>
        <select
          disabled={isSubmitting}
          value={internshipData.region}
          onChange={(e) => setInternshipData({ ...internshipData, region: e.target.value })}
          className={`input-field ${errors.region ? 'border-red-500' : ''}`}
        >
          <option value="">Выберите регион</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        {errors.region && <p className="error-text">{errors.region}</p>}
      </div>

      <div>
        <label className="label">ФИО <span className="text-red-500">*</span></label>
        <input
          disabled={isSubmitting}
          type="text"
          value={internshipData.fullName}
          onChange={(e) => setInternshipData({ ...internshipData, fullName: e.target.value })}
          className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
          placeholder="Иванов Иван Иванович"
        />
        {errors.fullName && <p className="error-text">{errors.fullName}</p>}
      </div>

      <div>
        <label className="label">Email <span className="text-red-500">*</span></label>
        <input
          disabled={isSubmitting}
          type="email"
          value={internshipData.email}
          onChange={(e) => setInternshipData({ ...internshipData, email: e.target.value })}
          className={`input-field ${errors.email ? 'border-red-500' : ''}`}
          placeholder="student@example.com"
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div>
        <label className="label">Тип образования <span className="text-red-500">*</span></label>
        <select
          disabled={isSubmitting}
          value={internshipData.educationType}
          onChange={(e) => setInternshipData({ ...internshipData, educationType: e.target.value })}
          className={`input-field ${errors.educationType ? 'border-red-500' : ''}`}
        >
          <option value="">Выберите тип</option>
          {educationTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        {errors.educationType && <p className="error-text">{errors.educationType}</p>}
      </div>

      <div>
        <label className="label">Учебное учреждение <span className="text-red-500">*</span></label>
        <input
          disabled={isSubmitting}
          type="text"
          value={internshipData.institution}
          onChange={(e) => setInternshipData({ ...internshipData, institution: e.target.value })}
          className={`input-field ${errors.institution ? 'border-red-500' : ''}`}
          placeholder="Название ВУЗа/СПО"
        />
        {errors.institution && <p className="error-text">{errors.institution}</p>}
      </div>

      <div>
        <label className="label">Направление подготовки <span className="text-red-500">*</span></label>
        <input
          disabled={isSubmitting}
          type="text"
          value={internshipData.specialization}
          onChange={(e) => setInternshipData({ ...internshipData, specialization: e.target.value })}
          className={`input-field ${errors.specialization ? 'border-red-500' : ''}`}
          placeholder="Например: Нефтегазовое дело"
        />
        {errors.specialization && <p className="error-text">{errors.specialization}</p>}
      </div>

      <div>
        <label className="label">Филиал <span className="text-red-500">*</span></label>
        <select
          disabled={isSubmitting}
          value={internshipData.branch}
          onChange={(e) => setInternshipData({ ...internshipData, branch: e.target.value })}
          className={`input-field ${errors.branch ? 'border-red-500' : ''}`}
        >
          <option value="">Выберите филиал</option>
          {branches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        {errors.branch && <p className="error-text">{errors.branch}</p>}
      </div>

      <div>
        <label className="label">Телефон <span className="text-red-500">*</span></label>
        <input
          disabled={isSubmitting}
          type="tel"
          value={internshipData.phone}
          onChange={(e) => setInternshipData({ ...internshipData, phone: e.target.value })}
          className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
          placeholder="+7 (999) 000-00-00"
        />
        {errors.phone && <p className="error-text">{errors.phone}</p>}
      </div>

      <div>
        <label className="label">Дополнительная информация</label>
        <textarea
          disabled={isSubmitting}
          value={internshipData.additionalInfo}
          onChange={(e) => setInternshipData({ ...internshipData, additionalInfo: e.target.value })}
          rows={3}
          className="input-field min-h-[80px] resize-none"
          placeholder="О себе..."
        />
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={isSubmitting ? undefined : onClose}>
      <style>{`
        .label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem; }
        .input-field { width: 100%; padding: 0.75rem 1rem; border-radius: 1rem; border: 2px solid #E5E7EB; outline: none; transition: border-color 0.2s; }
        .input-field:focus { border-color: #4A90E2; }
        .input-field:disabled { background-color: #F3F4F6; color: #9CA3AF; cursor: not-allowed; }
        .error-text { color: #EF4444; font-size: 0.875rem; margin-top: 0.25rem; }
      `}</style>

      <div
        className="bg-white rounded-[40px] w-full max-w-md max-h-[90vh] overflow-y-auto relative flex flex-col min-h-[300px]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Back/Close */}
        <div className="sticky top-0 bg-white z-20 px-6 py-4 flex items-center justify-between border-b border-gray-100">
          {(view !== 'choice' && submitStatus === 'idle' && !isSubmitting) ? (
            <button onClick={() => setView('choice')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          ) : <div className="w-10" />}

          <span className="font-semibold text-gray-800">
            {isSubmitting ? 'Минутку...' : submitStatus === 'idle' ? (view === 'choice' ? 'Меню' : view === 'employment' ? 'Трудоустройство' : 'Практика') : 'Статус'}
          </span>

          {!isSubmitting && (
            <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          )}
        </div>

        <div className="p-6 pb-24 flex-1">
          {isSubmitting || submitStatus !== 'idle' ? renderStatus() : (
            view === 'choice' ? renderChoice() : (
              <form onSubmit={handleSubmit}>
                {view === 'employment' ? renderEmploymentForm() : renderInternshipForm()}

                {/* Consent Checkbox */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        disabled={isSubmitting}
                        type="checkbox"
                        checked={consentGiven}
                        onChange={(e) => { setConsentGiven(e.target.checked); setConsentError(''); }}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-300 transition-all checked:border-[#4A90E2] checked:bg-[#4A90E2]"
                      />
                      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 leading-snug select-none group-hover:text-gray-900 transition-colors">
                      Даю согласие на{' '}
                      <a
                        href={privacyPolicyPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4A90E2] underline hover:text-[#357ABD]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        обработку персональных данных
                      </a>
                    </span>
                  </label>
                  {consentError && <p className="text-red-500 text-xs mt-1 ml-8 font-medium">{consentError}</p>}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1 py-3 text-base" disabled={isSubmitting}>
                    Отмена
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1 py-3 text-base shadow-lg shadow-blue-500/30" disabled={isSubmitting}>
                    Хочу к вам!
                  </Button>
                </div>
              </form>
            )
          )}
        </div>
      </div>
    </div>
  );
};
