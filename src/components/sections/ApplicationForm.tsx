import { useState, useEffect, useRef } from 'react';
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
  onResetStatus: () => void;
}

type FormType = 'employment' | 'internship' | 'excelTest';
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
const branches = ['Сургутский филиал', 'Ново-Уренгойский филиал', 'Тюменский филиал', 'Краснодарский филиал'];

const relocationDetailedOptions = [
  'Не готов',
  'Готов к переезду в любое место',
  'Готов к переезду в ЯНАО Новый Уренгой',
  'Готов к переезду в ЯНАО Ноябрьск',
  'Готов к переезду в ЯНАО п. Ханымей',
  'Готов к переезду в ЯНАО г. Губкинский',
  'Готов к переезду в ХМАО г. Сургут',
  'Готов к переезду в ХМАО г. Когалым',
  'Готов к переезду в ХМАО г. Нефтеюганск, Пыть-Ях',
  'Готов к переезду в ХМАО п. Салым',
  'Готов к переезду в Уватский р-н Тюменской области (МКС)',
  'Готов к переезду в Тобольск и Тобольский р-н Тюменской области',
  'Готов к переезду в г. Тюмень',
  'Готов к переезду в г. Ишим Тюменской области',
  'Готов к переезду в Ярковский район Тюменской области',
];

export const ApplicationForm = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  submitStatus = 'idle',
  errorMessage = '',
  onResetStatus
}: ApplicationFormProps) => {
  const formRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ViewState>('choice');

  const [employmentData, setEmploymentData] = useState({
    vacancy: '', fullName: '', age: '', workExperience: '', city: '',
    relocation: '', education: '', phone: '', email: '', additionalInfo: ''
  });

  const [internshipData, setInternshipData] = useState({
    region: '', fullName: '', email: '', educationType: '', institution: '',
    specialization: '', branch: '', phone: '', additionalInfo: '',
    course: '', internshipDateFrom: '', internshipDateTo: '', skills: '',
    competitions: '', sports: '', publications: ''
  });

  const [excelTestData, setExcelTestData] = useState({
    lastName: '', firstName: '', patronymic: '', birthDate: '', gender: '', citizenship: '',
    regAddress: '', factAddress: '', vacancy: '', education: '', educationDetail: '',
    certificates: '', experience: '', relocation: '', shiftWork: false, additionalInfoDetailed: '',
    email: '', phone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentError, setConsentError] = useState('');

  const formatDateInput = (value: string) => {
    // Убираем всё, кроме цифр
    let digits = value.replace(/\D/g, '').slice(0, 8);

    // Форматируем день (не больше 31)
    if (digits.length >= 2) {
      let day = parseInt(digits.slice(0, 2));
      if (day > 31) digits = '31' + digits.slice(2);
      if (day === 0 && digits.length === 2) digits = '01'; // Не даем ввести 00
      digits = digits.slice(0, 2) + '.' + digits.slice(2);
    }

    // Форматируем месяц (не больше 12)
    if (digits.length >= 5) {
      let month = parseInt(digits.slice(3, 5));
      if (month > 12) digits = digits.slice(0, 3) + '12' + digits.slice(5);
      if (month === 0 && digits.length === 5) digits = digits.slice(0, 3) + '01'; // Не даем ввести 00
      digits = digits.slice(0, 5) + '.' + digits.slice(5);
    }

    return digits;
  };

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

  // Format: dd.mm.yyyy, day 01-31, month 01-12 (rejects 33.33.3333 etc.)
  const validateDateDdMmYyyy = (s: string) => /^(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/.test(s.trim());

  const isValidCalendarDate = (s: string): boolean => {
    if (!validateDateDdMmYyyy(s)) return false;
    const [dd, mm, yyyy] = s.trim().split('.').map(Number);
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const febDays = (yyyy % 4 === 0 && yyyy % 100 !== 0) || yyyy % 400 === 0 ? 29 : 28;
    const maxDay = mm === 2 ? febDays : daysInMonth[mm - 1];
    return dd >= 1 && dd <= maxDay;
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
    if (!internshipData.course) newErrors.course = 'Выберите курс';
    if (!internshipData.internshipDateFrom.trim()) newErrors.internshipDateFrom = 'Укажите дату начала';
    else if (!validateDateDdMmYyyy(internshipData.internshipDateFrom) || !isValidCalendarDate(internshipData.internshipDateFrom)) newErrors.internshipDateFrom = 'Неправильная дата';
    if (!internshipData.internshipDateTo.trim()) newErrors.internshipDateTo = 'Укажите дату окончания';
    else if (!validateDateDdMmYyyy(internshipData.internshipDateTo) || !isValidCalendarDate(internshipData.internshipDateTo)) newErrors.internshipDateTo = 'Неправильная дата';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateExcelTest = () => {
    const newErrors: Record<string, string> = {};
    if (!excelTestData.lastName.trim()) newErrors.lastName = 'Введите фамилию';
    if (!excelTestData.firstName.trim()) newErrors.firstName = 'Введите имя';
    if (!excelTestData.birthDate.trim()) newErrors.birthDate = 'Введите дату рождения';
    else if (!validateDateDdMmYyyy(excelTestData.birthDate)) newErrors.birthDate = 'Формат: дд.мм.гггг';
    if (!excelTestData.gender) newErrors.gender = 'Выберите пол';
    if (!excelTestData.citizenship.trim()) newErrors.citizenship = 'Укажите гражданство';
    if (!excelTestData.regAddress.trim()) newErrors.regAddress = 'Введите адрес регистрации';
    if (!excelTestData.vacancy.trim()) newErrors.vacancy = 'Укажите вакансию';
    if (!excelTestData.education) newErrors.education = 'Выберите образование';
    if (!excelTestData.email.trim()) newErrors.email = 'Введите email';
    else if (!validateEmail(excelTestData.email)) newErrors.email = 'Некорректный email';
    if (!excelTestData.phone.trim()) newErrors.phone = 'Введите телефон';

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
    } else if (view === 'excelTest') {
      isValid = validateExcelTest();
      dataToSend = { type: 'excelTest', ...excelTestData };
    }

    if (isValid) {
      onSubmit(dataToSend);
    } else {
      // Scroll to top if validation fails so user can see errors
      formRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
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
          <Button onClick={() => { setView('choice'); onResetStatus(); }} variant="outline" className="w-full">Вернуться к выбору</Button>
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
          onClick={() => setView('excelTest')}
          className="w-full bg-[#4A90E2] text-white p-6 rounded-[24px] text-left hover:bg-[#357ABD] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-1">Заявка на трудоустройство</h3>
            <p className="text-blue-100 text-sm opacity-90">Для соискателя</p>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform" />
        </button>

        <button
          onClick={() => setView('internship')}
          className="w-full bg-white text-[#1A1A1A] p-6 rounded-[24px] text-left border-2 border-gray-100 hover:border-[#4A90E2] transition-all shadow-md hover:shadow-lg hover:-translate-y-1 relative overflow-hidden group"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-1">Стажировка</h3>
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

  const renderExcelTestForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="label">Фамилия <span className="text-red-500">*</span></label>
          <input disabled={isSubmitting} type="text" value={excelTestData.lastName} onChange={(e) => setExcelTestData({ ...excelTestData, lastName: e.target.value })} className={`input-field ${errors.lastName ? 'border-red-500' : ''}`} placeholder="Иванов" />
          {errors.lastName && <p className="error-text">{errors.lastName}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Имя <span className="text-red-500">*</span></label>
            <input disabled={isSubmitting} type="text" value={excelTestData.firstName} onChange={(e) => setExcelTestData({ ...excelTestData, firstName: e.target.value })} className={`input-field ${errors.firstName ? 'border-red-500' : ''}`} placeholder="Иван" />
            {errors.firstName && <p className="error-text">{errors.firstName}</p>}
          </div>
          <div>
            <label className="label">Отчество</label>
            <input disabled={isSubmitting} type="text" value={excelTestData.patronymic} onChange={(e) => setExcelTestData({ ...excelTestData, patronymic: e.target.value })} className="input-field" placeholder="Иванович" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Дата рождения <span className="text-red-500">*</span></label>
          <input
            disabled={isSubmitting}
            type="text"
            value={excelTestData.birthDate}
            onChange={(e) => setExcelTestData({ ...excelTestData, birthDate: formatDateInput(e.target.value) })}
            className={`input-field ${errors.birthDate ? 'border-red-500' : ''}`}
            placeholder="дд.мм.гггг"
          />
          {errors.birthDate && <p className="error-text">{errors.birthDate}</p>}
        </div>
        <div>
          <label className="label">Пол <span className="text-red-500">*</span></label>
          <select disabled={isSubmitting} value={excelTestData.gender} onChange={(e) => setExcelTestData({ ...excelTestData, gender: e.target.value })} className={`input-field ${errors.gender ? 'border-red-500' : ''}`}>
            <option value="">Выберите</option>
            <option value="Мужской">Мужской</option>
            <option value="Женский">Женский</option>
          </select>
          {errors.gender && <p className="error-text">{errors.gender}</p>}
        </div>
      </div>

      <div>
        <label className="label">Гражданство <span className="text-red-500">*</span></label>
        <input disabled={isSubmitting} type="text" value={excelTestData.citizenship} onChange={(e) => setExcelTestData({ ...excelTestData, citizenship: e.target.value })} className={`input-field ${errors.citizenship ? 'border-red-500' : ''}`} placeholder="РФ" />
        {errors.citizenship && <p className="error-text">{errors.citizenship}</p>}
      </div>

      <div>
        <label className="label">Адрес по месту регистрации <span className="text-red-500">*</span></label>
        <input disabled={isSubmitting} type="text" value={excelTestData.regAddress} onChange={(e) => setExcelTestData({ ...excelTestData, regAddress: e.target.value })} className={`input-field ${errors.regAddress ? 'border-red-500' : ''}`} />
        {errors.regAddress && <p className="error-text">{errors.regAddress}</p>}
      </div>

      <div>
        <label className="label">Фактический адрес</label>
        <input disabled={isSubmitting} type="text" value={excelTestData.factAddress} onChange={(e) => setExcelTestData({ ...excelTestData, factAddress: e.target.value })} className="input-field" placeholder="Оставьте пустым, если совпадает" />
      </div>

      <div>
        <label className="label">Вакансия <span className="text-red-500">*</span></label>
        <input disabled={isSubmitting} type="text" value={excelTestData.vacancy} onChange={(e) => setExcelTestData({ ...excelTestData, vacancy: e.target.value })} className={`input-field ${errors.vacancy ? 'border-red-500' : ''}`} placeholder="На какую должность претендуете" />
        {errors.vacancy && <p className="error-text">{errors.vacancy}</p>}
      </div>

      <div>
        <label className="label">Образование <span className="text-red-500">*</span></label>
        <select disabled={isSubmitting} value={excelTestData.education} onChange={(e) => setExcelTestData({ ...excelTestData, education: e.target.value })} className={`input-field ${errors.education ? 'border-red-500' : ''}`}>
          <option value="">Выберите образование</option>
          {educationOptions.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {errors.education && <p className="error-text">{errors.education}</p>}
      </div>

      <div>
        <label className="label">Специальность (когда и какой ВУЗ окончен)</label>
        <textarea disabled={isSubmitting} value={excelTestData.educationDetail} onChange={(e) => setExcelTestData({ ...excelTestData, educationDetail: e.target.value })} className="input-field min-h-[80px]" placeholder="Например: 2020 год, Тюменский индустриальный университет" />
      </div>

      <div>
        <label className="label">Удостоверения (для рабочих/категории водит.)</label>
        <input disabled={isSubmitting} type="text" value={excelTestData.certificates} onChange={(e) => setExcelTestData({ ...excelTestData, certificates: e.target.value })} className="input-field" />
      </div>

      <div>
        <label className="label">Стаж работы по профессии (лет)</label>
        <input disabled={isSubmitting} type="number" step="0.5" value={excelTestData.experience} onChange={(e) => setExcelTestData({ ...excelTestData, experience: e.target.value })} className="input-field" />
      </div>

      <div className="flex flex-col gap-3">
        <label className="label">Готовность к переезду</label>
        <select disabled={isSubmitting} value={excelTestData.relocation} onChange={(e) => setExcelTestData({ ...excelTestData, relocation: e.target.value })} className="input-field">
          <option value="">Выберите вариант</option>
          {relocationDetailedOptions.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              disabled={isSubmitting}
              type="checkbox"
              checked={excelTestData.shiftWork}
              onChange={(e) => setExcelTestData({ ...excelTestData, shiftWork: e.target.checked })}
              className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-300 transition-all checked:border-[#4A90E2] checked:bg-[#4A90E2]"
            />
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700 leading-snug select-none group-hover:text-black">
            Готов работать вахтовым методом
          </span>
        </label>
      </div>

      <div>
        <label className="label">Дополнительные сведения</label>
        <textarea disabled={isSubmitting} value={excelTestData.additionalInfoDetailed} onChange={(e) => setExcelTestData({ ...excelTestData, additionalInfoDetailed: e.target.value })} className="input-field min-h-[80px]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Телефон <span className="text-red-500">*</span></label>
          <input disabled={isSubmitting} type="tel" value={excelTestData.phone} onChange={(e) => setExcelTestData({ ...excelTestData, phone: e.target.value })} className={`input-field ${errors.phone ? 'border-red-500' : ''}`} placeholder="+7 (___) ___-__-__" />
          {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>
        <div>
          <label className="label">Email <span className="text-red-500">*</span></label>
          <input disabled={isSubmitting} type="email" value={excelTestData.email} onChange={(e) => setExcelTestData({ ...excelTestData, email: e.target.value })} className={`input-field ${errors.email ? 'border-red-500' : ''}`} placeholder="example@mail.ru" />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
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
        <label className="label">Курс <span className="text-red-500">*</span></label>
        <select
          disabled={isSubmitting}
          value={internshipData.course}
          onChange={(e) => setInternshipData({ ...internshipData, course: e.target.value })}
          className={`input-field ${errors.course ? 'border-red-500' : ''}`}
        >
          <option value="">Выберите курс</option>
          {[1, 2, 3, 4, 5].map(n => <option key={n} value={String(n)}>{n}</option>)}
        </select>
        {errors.course && <p className="error-text">{errors.course}</p>}
      </div>

      <div>
        <label className="label">Период стажировки <span className="text-red-500">*</span></label>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            disabled={isSubmitting}
            type="text"
            value={internshipData.internshipDateFrom}
            onChange={(e) => setInternshipData({ ...internshipData, internshipDateFrom: formatDateInput(e.target.value) })}
            className={`input-field flex-1 min-w-0 ${errors.internshipDateFrom ? 'border-red-500' : ''}`}
            placeholder="с дд.мм.гггг"
          />
          <span className="text-gray-500 shrink-0">по</span>
          <input
            disabled={isSubmitting}
            type="text"
            value={internshipData.internshipDateTo}
            onChange={(e) => setInternshipData({ ...internshipData, internshipDateTo: formatDateInput(e.target.value) })}
            className={`input-field flex-1 min-w-0 ${errors.internshipDateTo ? 'border-red-500' : ''}`}
            placeholder="дд.мм.гггг"
          />
        </div>
        {(errors.internshipDateFrom || errors.internshipDateTo) && (
          <p className="error-text">{errors.internshipDateFrom || errors.internshipDateTo}</p>
        )}
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
        <label className="label">Описание навыков и умений</label>
        <textarea
          disabled={isSubmitting}
          value={internshipData.skills}
          onChange={(e) => setInternshipData({ ...internshipData, skills: e.target.value })}
          rows={3}
          className="input-field min-h-[80px] resize-none"
          placeholder="Какие у вас есть навыки"
        />
      </div>

      <div>
        <label className="label">В каких конкурсах принимали участие?</label>
        <textarea
          disabled={isSubmitting}
          value={internshipData.competitions}
          onChange={(e) => setInternshipData({ ...internshipData, competitions: e.target.value })}
          rows={3}
          className="input-field min-h-[80px] resize-none"
          placeholder="Перечислите конкурсы..."
        />
      </div>

      <div>
        <label className="label">Какие у вас спортивные достижения?</label>
        <textarea
          disabled={isSubmitting}
          value={internshipData.sports}
          onChange={(e) => setInternshipData({ ...internshipData, sports: e.target.value })}
          rows={3}
          className="input-field min-h-[80px] resize-none"
          placeholder="Ваши достижения в спорте..."
        />
      </div>

      <div>
        <label className="label">Какие у вас имеются статьи, публикации?</label>
        <textarea
          disabled={isSubmitting}
          value={internshipData.publications}
          onChange={(e) => setInternshipData({ ...internshipData, publications: e.target.value })}
          rows={3}
          className="input-field min-h-[80px] resize-none"
          placeholder="Статьи, публикации, научные работы..."
        />
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
        ref={formRef}
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
            {isSubmitting ? 'Минутку...' : submitStatus === 'idle' ? (view === 'choice' ? 'Меню' : view === 'excelTest' ? 'Заявка на трудоустройство' : view === 'internship' ? 'Стажировка' : 'Трудоустройство') : 'Статус'}
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
                {view === 'employment' ? renderEmploymentForm() : view === 'internship' ? renderInternshipForm() : renderExcelTestForm()}

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
                {Object.keys(errors).length > 0 && (
                  <p className="text-red-500 text-sm mb-4 font-medium text-center">
                    Пожалуйста, заполните все обязательные поля корректно
                  </p>
                )}
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
