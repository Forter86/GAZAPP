import { useState, useRef } from 'react';
import { Heading } from '../atoms/Heading';
import { Card } from '../atoms/Card';
import {
    X,
    Info,
    GraduationCap,
    Users,
    Briefcase,
    Heart,
    History,
    TrendingUp,
    Network,
    Award,
    ChevronRight,
    Loader2,
    CheckCircle2,
    XCircle,
    School,
    FileText,
    MapPin,
    ArrowLeft
} from 'lucide-react';

import aboutMainImg from '../../assets/about_company/main.jpg';
import aboutMissionImg from '../../assets/about_company/mission.jpg';
import targetUsloviyaImg from '../../assets/target_edu/usloviya.jpg';
import ssoMainImg from '../../assets/SSO/main.jpg';
import ssoVidyImg from '../../assets/SSO/vidy.jpg';
import ssoPriorityImg from '../../assets/SSO/priority_vectors.jpg';
import ssoPartnersImg from '../../assets/SSO/partners.jpg';
import ssoTraektoryImg from '../../assets/SSO/traektory.jpg';
import eventsAboutImg from '../../assets/events/about.jpg';

interface Category {
    id: string;
    title: string;
    icon: any;
}

interface SubTopicLink {
    text: string;
    url: string;
}

interface SubTopic {
    id: string;
    title: string;
    icon: any;
    content: string;
    category: string;
    image?: string;
    links?: SubTopicLink[];
    isForm?: boolean;
    isHighlighted?: boolean;
}

const categories: Category[] = [
    { id: 'about', title: 'О компании', icon: Info },
    { id: 'target', title: 'Целевое обучение', icon: GraduationCap },
    { id: 'practice', title: 'Практика и ССО', icon: Users },
    { id: 'career', title: 'Работа в обществе', icon: Briefcase },
    { id: 'social', title: 'Мероприятия', icon: Heart },
];

const subTopics: SubTopic[] = [
    // О компании
    {
        id: 'history',
        category: 'about',
        title: 'История компании',
        icon: History,
        image: aboutMainImg,
        content: `📜 История компании

ООО «Газпром трансгаз Сургут»
 Это 100% дочернее предприятие ПАО «Газпром» с богатой историей и стратегическим значением
🗓 Дата основания: 23 февраля 1977 года
🏢 Штаб-квартира: г. Сургут

История предприятия неразрывно связана с великой летописью освоения нефтегазовой Сибири.`,
        links: [
            { text: '📍 Где мы работаем?', url: 'internal:where_we_work' },
            { text: '🏗 Ключевые достижения 🏆', url: 'internal:key_projects' }
        ]
    },
    {
        id: 'where_we_work',
        category: 'hidden',
        title: 'Где мы работаем?',
        icon: MapPin,
        content: `📍 Где мы работаем?
Масштабы нашей деятельности охватывают ключевые регионы России:
 • ЯНАО (Ямало-Ненецкий автономный округ)
 • ХМАО — Югра
 • Тюменская область
 • Краснодарский край
Административный центр управления — город Сургут.`
    },
    {
        id: 'key_projects',
        category: 'hidden',
        title: 'Ключевые достижения',
        icon: Award,
        content: `🏗 Исторические проекты

Мы стояли у истоков создания крупнейшей газотранспортной сети:
 • Магистрали: Строительство газопроводов «Заполярное — Уренгой» и «Уренгой — Сургут — Челябинск».
 • Месторождения: Промышленное освоение Вынгапуровского, Комсомольского, Губкинского и Заполярного месторождений.
 • Переработка: Создание уникального завода по стабилизации конденсата в Сургутском районе.`
    },
    {
        id: 'mission',
        category: 'about',
        title: 'Миссия и ценности',
        icon: TrendingUp,
        image: aboutMissionImg,
        content: `🎯 Миссия и ценности

Основные направления деятельности:
• Надежный транспорт природного газа по системам магистральных газопроводов
• Промышленная и экологическая безопасность
• Энергетическая эффективность
• Создание достойных условий труда

Ключевые показатели:
• 6 278 км магистральных газопроводов
• Ежегодный транспорт газа — ~166,5 млрд м³
• Всего транспортировано — свыше 6 трлн м³ газа
• 18 компрессорных станций с 273 газоперекачивающими агрегатами
• 53 газораспределительные станции

Приоритеты деятельности:
Промышленная, пожарная и экологическая безопасность опасных производственных объектов, их эксплуатационная надёжность, экономическая и энергетическая эффективность транспорта газа`
    },
    {
        id: 'structure',
        category: 'about',
        title: 'Структура компании',
        icon: Network,
        content: `🧩 Структура компании

В составе Общества 24 филиала:
• 14 линейных производственных управлений магистральных газопроводов
• 18 компрессорных станций (273 ГПА)
• 53 газораспределительные станции
• Инженерно-технический центр
• Учебный центр
• Управление технологического транспорта и специальной техники
• Управление аварийно-восстановительных работ
• Медико-санитарная часть

Производственные объекты расположены в 3-х субъектах РФ:
• Ямало-Ненецкий автономный округ
• Ханты-Мансийский автономный округ — Югра
• Тюменская область

Коллектив:
• Более 8 600 сотрудников
• Ежегодно принимают 40+ молодых специалистов
• Действует Совет молодых ученых и специалистов`
    },
    {
        id: 'achievements',
        category: 'about',
        title: 'Достижения',
        icon: Award,
        content: `🏆 Достижения

2023 год:
• 1 место во Всероссийском конкурсе лучших практик трудоустройства молодёжи среди 745 организаций из 72 регионов

Корпоративные награды:
• Номинант конкурса ПАО «Газпром» в области управления персоналом
• Победитель смотра-конкурса «На лучшую организацию работы в области охраны труда и регулирования социально-трудовых отношений»
• Призер конкурсов «Черное золото Югры» и «Российская организация высокой социальной эффективности»

Система менеджмента:
• Действует интегрированная система менеджмента (качество, экология, энергетика, охрана труда)

Социальная политика:
• Действует коллективный договор с льготами и гарантиями для работников
• Дополнительные льготы для работников Крайнего Севера
• Активное участие в культурных и спортивных событиях регионов`
    },
    // Практика и ССО
    {
        id: 'practice-info',
        category: 'practice',
        title: 'Общая информация',
        icon: Info,
        image: ssoMainImg,
        content: `ℹ️ Практика и строительные отряды — Общая информация

Предлагаем стать частью команды - пройти практику с возможностью последующего трудоустройства в динамичной и высокотехнологичной среде. 

Более 500 студентов ежегодно получают навыки работы на производстве в нашем Обществе.

✅ Преимущества:
• Работа с передовыми технологиями
• Опытные наставники
• Возможность дальнейшего трудоустройства
• Комфортные условия и поддержка
• Проживание организовано в вахтовых поселках (за пределами г. Сургут)`,
        links: [
            { text: 'Анкета на прохождение практики', url: 'https://forms.yandex.ru/u/67acb209d046880fc0250ee1/?yqrid=be9e3c88' },
            { text: 'Анкета на трудоустройство после выпуска', url: 'https://forms.yandex.ru/u/67bdd3b55056903b49fe323c/?yqrid=78fda7df' }
        ]
    },
    {
        id: 'practice-types',
        category: 'practice',
        title: 'Виды практики и требования',
        icon: GraduationCap,
        image: ssoVidyImg,
        content: `📋 Практика и строительные отряды — Виды практики

Практика с оплатой:
• Срок практики свыше 1,5 месяцев
• Средний балл успеваемости 4,0
• Возраст от 18 лет
• Наличие свидетельства о профессии рабочего

Практика без оплаты:
• Срок практики до 1,5 месяцев
• Средний балл успеваемости 4,0

Строительный отряд:
• Студенты и выпускники до 25 лет
• Срок трудоустройства - 2 месяца
• Прием независимо от направления обучения

Примечание: Наличие свидетельства о профессии рабочего позволяет устроить студента на практику по профессии рабочего согласно имеющемуся разряду.`
    },
    {
        id: 'practice-directions',
        category: 'practice',
        title: 'Приоритетные направления',
        icon: TrendingUp,
        image: ssoPriorityImg,
        content: `🎯 Практика и строительные отряды — Приоритетные направления

Технические направления:
• Сооружение и эксплуатация газонефтепроводов
• Автоматизация технологических процессов
• Монтаж и эксплуатация электрооборудования
• Монтаж систем газоснабжения
• Разработка нефтяных и газовых месторождений
• Нефтегазовое дело
• Электроэнергетика и электротехника
• Теплоэнергетика и теплотехника

Рабочие профессии:
• Машинист технологических компрессоров
• Слесарь по ремонту технологических установок
• Слесарь КИПиА
• Электрогазосварщик
• Электромонтер по ремонту электрооборудования
• Трубопроводчик линейный`
    },
    {
        id: 'practice-partners',
        category: 'practice',
        title: 'Вузы-партнеры',
        icon: Network,
        image: ssoPartnersImg,
        content: `🏫 Практика и строительные отряды — Вузы-партнеры

Образовательные организации-партнеры:
• Тюменский индустриальный университет
• Сургутский государственный университет
• Санкт-Петербургский горный университет
• Югорский государственный университет
• Сургутский политехнический колледж
• Газпром техникум Новый Уренгой
• Газпром колледж Волгоград`
    },
    {
        id: 'practice-career',
        category: 'practice',
        title: 'Карьерные траектории',
        icon: Award,
        image: ssoTraektoryImg,
        content: `🚀 Практика и строительные отряды — Карьерные траектории

Пример карьерного роста:
🎓 Студент технического вуза
🔧 Практика в ООО «Газпром трансгаз Сургут»
👨💼 Должность рабочего или специалиста
💼 Инженерная должность
⭐ Руководящая позиция

Практика в нашем Обществе - это первый шаг к успешной карьере в газовой отрасли!`
    },
    // Работа в обществе
    {
        id: 'career-vacancies',
        category: 'career',
        title: 'Информация о вакансиях',
        icon: Briefcase,
        content: `💼 Информация о вакансиях

ООО «Газпром трансгаз Сургут» — это команда профессионалов, обеспечивающих бесперебойную транспортировку газа по магистральным газопроводам.

Мы ищем энергичных, ответственных специалистов, готовых к решению нестандартных задач и работе в динамичной среде.

Если вы не нашли подходящей вакансии:
• Направьте своё резюме через форму в боте
• К сожалению, мы не можем ответить всем соискателям
• Заранее благодарим за проявленный интерес

Процесс рассмотрения:
• При положительном решении специалисты отдела кадров свяжутся с вами
• Если в течение двух недель нет ответа — подходящей вакансии пока нет`
    },
    {
        id: 'career-site-link',
        category: 'career',
        title: 'Посмотреть вакансии на сайте',
        icon: Network,
        content: '',
        isHighlighted: true,
        links: [
            { text: 'Перейти на сайт', url: 'https://surgut-tr.gazprom.ru/career/vakansii/?p=0' }
        ]
    },
    // Мероприятия
    {
        id: 'events-info',
        category: 'social',
        title: 'Информация об экскурсиях',
        icon: Info,
        image: eventsAboutImg,
        content: `🎉 Информация об экскурсиях и мероприятиях

Фестиваль работающей молодежи
80 молодых специалистов собрались в Сургуте для обсуждения научного потенциала предприятия. Команды представили проекты по решению актуальных задач компании.

IT-форум в Ханты-Мансийске
Специалисты посетили международный IT-форум с участием стран БРИКС и ШОС. Обсудили тренды цифровизации и искусственный интеллект.

Учебный полигон
Центр опережающей профессиональной подготовки посетил уникальный учебный полигон компании. Возможности для сотрудничества в проектах «Профессионалитет» и целевого обучения.

Студенческие строительные отряды
Активисты стройки «Звезда Оби» посетили учебный полигон. Знакомство с производственными процессами и возможностями практики.

Экологическая акция
Специалисты участвовали во Всероссийской акции «Вода России» по очистке берегов водных объектов.

Форум «Лидер»
Руководитель УПЦ выступил на управленческом форуме, обсуждая подготовку кадров и сотрудничество с вузами.`
    },
    {
        id: 'event-form-btn',
        category: 'social',
        title: 'Заполнить форму заявки на мероприятие',
        icon: Briefcase,
        content: '',
        isHighlighted: true,
        isForm: true
    },
    {
        id: 'event-tg-link',
        category: 'social',
        title: 'Актуальные мероприятия в Telegram',
        icon: Heart,
        content: '',
        links: [
            { text: 'Перейти в Telegram', url: 'https://t.me/gazpromtransgazsurgut' }
        ]
    },
    // --- ЦЕЛЕВОЕ ОБУЧЕНИЕ ---
    {
        id: 'target-conditions',
        category: 'target',
        title: 'Условия целевого обучения',
        icon: FileText,
        image: targetUsloviyaImg,
        content: `📘 Целевое обучение — Условия

Что такое целевое обучение?
Это форма обучения, при которой абитуриент заключает договор с будущим работодателем. Студент учится бесплатно, получает стипендию и дополнительные меры поддержки.

✅ Преимущества:
• Гарантированное трудоустройство после обучения
• Дополнительная стипендия и меры поддержки
• Практика и стажировка в процессе обучения

❌ Ответственность:
• Необходимость отработки от 3 до 5 лет
• Штрафы при невыполнении условий договора

Как поступить по целевой квоте?
1. Подайте заявление на «Госуслугах»
2. Ответьте «Да» на вопрос о целевом обучении
3. Выберите подходящее предложение заказчика
4. Отметьте в заявлении конкурс по целевой квоте

Сроки подачи:
• Бакалавриат/специалитет: 20 июня - 25 июля
• Магистратура: 20 июня - 20 августа

Ответственность:
При невыполнении обязательств по договору необходимо возместить затраты на меры поддержки и выплатить штраф в размере затрат на обучение....`
    },
    {
        id: 'target-universities',
        category: 'target',
        title: 'Список вузов партнеров',
        icon: School,
        content: `🏫 Целевое обучение — Список вузов-партнеров

Информация о целевом обучении от Общества

Ежегодно ООО «Газпром трансгаз Сургут» размещает предложения целевого обучения на сайте "Работа России". Предложения на 2026 год будут доступны в мае.

При заключении договора целевые студенты получают:
• Стипендию от предприятия
• Оплачиваемую практику  
• Гарантированное трудоустройство в филиалы компании

🎯 Ключевые направления подготовки:
• 21.03.01 Нефтегазовое дело
• 15.03.04 Автоматизация технологических процессов
• 13.03.01 Теплоэнергетика и теплотехника

🏛️ Вузы-партнеры:
• Тюменский индустриальный университет
• РГУ нефти и газа имени И. М. Губкина 
• Санкт-Петербургский политехнический университет
• Санкт-Петербургский горный университет`
    }
];

export const KnowledgeSection = () => {
    const [activeCategory, setActiveCategory] = useState('about');
    const [selectedTopic, setSelectedTopic] = useState<SubTopic | null>(null);

    // Drag-to-scroll state for categories
    const categoriesRef = useRef<HTMLDivElement>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [hasMoved, setHasMoved] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!categoriesRef.current) return;
        setIsMouseDown(true);
        setHasMoved(false);
        setStartX(e.pageX - categoriesRef.current.offsetLeft);
        setScrollLeft(categoriesRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsMouseDown(false);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        setIsMouseDown(false);
        if (hasMoved) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isMouseDown || !categoriesRef.current) return;
        const x = e.pageX - categoriesRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed

        if (Math.abs(walk) > 5) {
            setHasMoved(true);
        }

        categoriesRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleCategoryClick = (id: string) => {
        if (!hasMoved) {
            setActiveCategory(id);
        }
    };

    // Состояния для формы
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const activeSubTopics = subTopics.filter(topic => topic.category === activeCategory);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        const tg = (window as any).Telegram?.WebApp;
        const userId = tg?.initDataUnsafe?.user?.id || 'Не указан';
        const username = tg?.initDataUnsafe?.user?.username
            ? `@${tg.initDataUnsafe.user.username}`
            : tg?.initDataUnsafe?.user?.first_name || 'Не указан';

        const now = new Date();
        const dateTime = now.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).replace(',', '');

        const formData = new FormData(e.currentTarget);
        const data = {
            type: 'event',
            fullName: formData.get('fullName'),
            place: formData.get('place'),
            category: formData.get('category'),
            organization: formData.get('organization'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            participantsCount: formData.get('participantsCount'),
            userId: userId,
            username: username,
            dateTime: dateTime
        };

        try {
            const response = await fetch('/api/send-application', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSubmitStatus('success');
            } else {
                const errorData = await response.json();
                setSubmitStatus('error');
                setErrorMessage(errorData.message || 'Ошибка при отправке');
            }
        } catch (error) {
            setSubmitStatus('error');
            setErrorMessage('Сетевая ошибка. Попробуйте позже.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetModal = () => {
        setSelectedTopic(null);
        setSubmitStatus('idle');
        setIsSubmitting(false);
        setErrorMessage('');
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
                    <p className="text-gray-600 mb-8 text-lg">Заявка на мероприятие отправлена. Мы свяжемся с вами!</p>
                    <button
                        onClick={resetModal}
                        className="w-full py-4 rounded-2xl bg-[#4A90E2] text-white font-bold hover:bg-[#357ABD] transition-colors shadow-lg shadow-blue-500/20"
                    >
                        Отлично
                    </button>
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
                    <button
                        onClick={() => setSubmitStatus('idle')}
                        className="w-full py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
                    >
                        Попробовать снова
                    </button>
                </div>
            );
        }

        return null;
    };

    return (
        <section className="px-6 py-12 relative z-30">
            <div className="max-w-md mx-auto">
                <Heading level={2} className="mb-8 text-center">
                    Узнай больше интересного о нас!
                </Heading>

                {/* Категории - горизонтальный скролл на мобилках и десктопе */}
                <div
                    ref={categoriesRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className={`flex overflow-x-auto pb-4 gap-3 no-scrollbar mb-8 -mx-2 px-2 ${isMouseDown ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                    style={{ scrollBehavior: isMouseDown ? 'auto' : 'smooth' }}
                >
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id)}
                                className={`flex flex-col items-center justify-center min-w-[100px] p-3 rounded-2xl transition-all border-2 ${isActive
                                    ? 'bg-[#4A90E2] border-[#4A90E2] text-white shadow-lg shadow-blue-500/20'
                                    : 'bg-white border-transparent text-gray-500 hover:border-gray-200'
                                    }`}
                            >
                                <Icon size={24} className="mb-2" />
                                <span className="text-[10px] font-bold uppercase text-center leading-tight">
                                    {cat.title}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Список подтем */}
                <div className="space-y-4 min-h-[300px]">
                    {activeSubTopics.length > 0 ? (
                        activeSubTopics.map((topic) => {
                            const Icon = topic.icon;
                            // Проверяем, является ли топик подсвеченной кнопкой (вакансии или форма)
                            const showShimmer = topic.isHighlighted;

                            if (showShimmer) {
                                const ContentWrapper = topic.links?.[0] ? 'a' : 'button';
                                const wrapperProps = topic.links?.[0]
                                    ? { href: topic.links[0].url, target: "_blank", rel: "noopener noreferrer" }
                                    : {
                                        onClick: () => {
                                            setSubmitStatus('idle');
                                            setSelectedTopic(topic);
                                        }
                                    };

                                return (
                                    <ContentWrapper
                                        key={topic.id}
                                        {...wrapperProps}
                                        className="block w-full group relative overflow-hidden rounded-[24px] p-[2px] transition-all hover:scale-[1.02] active:scale-[0.98] text-left"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#4A90E2] via-[#67B26F] to-[#4A90E2] bg-[length:200%_100%] animate-shimmer" />

                                        <Card className="relative p-4 flex items-center justify-between border-none bg-white/95 backdrop-blur-sm h-full !rounded-[22px]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#4A90E2]">
                                                    <Icon size={24} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 text-lg leading-tight">{topic.title}</span>
                                                    <span className="text-[10px] uppercase tracking-wider text-[#4A90E2] font-bold mt-1">
                                                        {topic.isForm ? 'Интерактивная форма' : 'Официальный ресурс'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="bg-[#4A90E2] text-white p-2 rounded-xl shadow-lg shadow-blue-200">
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </Card>
                                    </ContentWrapper>
                                );
                            }

                            // Для обычных ссылок (например Telegram), если нет текста контента
                            if (!topic.content && topic.links?.[0]) {
                                return (
                                    <a
                                        key={topic.id}
                                        href={topic.links[0].url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full text-left group block"
                                    >
                                        <Card className="p-4 flex items-center justify-between hover:shadow-md transition-all border-l-4 border-blue-400 hover:scale-[1.01] active:scale-[0.99] !rounded-[24px]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#4A90E2] group-hover:bg-[#4A90E2] group-hover:text-white transition-colors">
                                                    <Icon size={24} />
                                                </div>
                                                <span className="font-bold text-gray-800 text-lg">{topic.title}</span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#4A90E2] transition-colors" />
                                        </Card>
                                    </a>
                                );
                            }

                            return (
                                <button
                                    key={topic.id}
                                    onClick={() => setSelectedTopic(topic)}
                                    className="w-full text-left group"
                                >
                                    <Card className="p-4 flex items-center justify-between hover:shadow-md transition-all border-l-4 border-[#4A90E2] hover:scale-[1.01] active:scale-[0.99] !rounded-[24px]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#4A90E2] group-hover:bg-[#4A90E2] group-hover:text-white transition-colors">
                                                <Icon size={24} />
                                            </div>
                                            <span className="font-bold text-gray-800 text-lg">{topic.title}</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#4A90E2] transition-colors" />
                                    </Card>
                                </button>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center opacity-50 bg-white/50 rounded-[32px] border-2 border-dashed border-gray-200">
                            <Info size={48} className="mb-4 text-gray-300" />
                            <p className="text-gray-500 font-medium px-8">
                                Этот раздел скоро наполнится полезной информацией!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Модальное окно */}
            {selectedTopic && (
                <div
                    className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setSelectedTopic(null)}
                >
                    <div
                        className="bg-white rounded-[40px] w-full max-w-md max-h-[85vh] overflow-y-auto relative shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-5 duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-20 px-8 py-6 flex items-center justify-between border-b border-gray-100/50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#4A90E2]/10 text-[#4A90E2] flex items-center justify-center">
                                    <selectedTopic.icon size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                        {isSubmitting ? 'Минутку...' : submitStatus !== 'idle' ? 'Статус' : selectedTopic.title}
                                    </h3>
                                    {selectedTopic.category === 'hidden' && (
                                        <button
                                            onClick={() => {
                                                const historyTopic = subTopics.find(t => t.id === 'history');
                                                if (historyTopic) setSelectedTopic(historyTopic);
                                            }}
                                            className="text-[10px] font-bold text-[#4A90E2] uppercase flex items-center gap-1 mt-1 hover:underline"
                                        >
                                            <ArrowLeft size={10} /> Назад в историю
                                        </button>
                                    )}
                                </div>
                            </div>
                            {!isSubmitting && (
                                <button
                                    onClick={resetModal}
                                    className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-400" />
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        <div className={`p-8 ${selectedTopic.links || (selectedTopic.isForm && submitStatus === 'idle' && !isSubmitting) ? 'pb-4' : ''}`}>
                            {isSubmitting || submitStatus !== 'idle' ? renderStatus() : (
                                selectedTopic.isForm ? (
                                    <form className="space-y-5" onClick={e => e.stopPropagation()} onSubmit={handleFormSubmit}>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">ФИО контактного лица</label>
                                            <input
                                                name="fullName"
                                                type="text"
                                                placeholder="Иванов Иван Иванович"
                                                className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#4A90E2] focus:bg-white outline-none transition-all"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Выбрать место экскурсии</label>
                                            <select name="place" className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#4A90E2] focus:bg-white outline-none transition-all appearance-none" required>
                                                <option value="">Выберите из списка...</option>
                                                <option>Музей истории</option>
                                                <option>Производственный объект</option>
                                                <option>Офис компании</option>
                                                <option>Другое</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Указать категорию</label>
                                            <select name="category" className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#4A90E2] focus:bg-white outline-none transition-all appearance-none" required>
                                                <option value="">Выберите из списка...</option>
                                                <option>Школьники</option>
                                                <option>Студенты</option>
                                                <option>Взрослые</option>
                                                <option>Смешанная группа</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Указать организацию</label>
                                            <input
                                                name="organization"
                                                type="text"
                                                placeholder="Например: МБОУ СОШ №1"
                                                className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#4A90E2] focus:bg-white outline-none transition-all"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-5">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Номер телефона</label>
                                                <input
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="+7 (___) ___-__-__"
                                                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#4A90E2] focus:bg-white outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                                <input
                                                    name="email"
                                                    type="email"
                                                    placeholder="example@mail.ru"
                                                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#4A90E2] focus:bg-white outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Количество участников</label>
                                            <input
                                                name="participantsCount"
                                                type="number"
                                                min="1"
                                                placeholder="0"
                                                className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#4A90E2] focus:bg-white outline-none transition-all"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white font-bold text-xl shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                                        >
                                            Отправить заявку
                                        </button>
                                    </form>
                                ) : (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
                                        {selectedTopic.image && (
                                            <div className="relative group overflow-hidden rounded-2xl shadow-xl border-4 border-white ring-1 ring-gray-100 transition-transform hover:scale-[1.01]">
                                                <img
                                                    src={selectedTopic.image}
                                                    alt={selectedTopic.title}
                                                    className="w-full h-auto object-cover max-h-[220px]"
                                                />
                                            </div>
                                        )}
                                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                                            {selectedTopic.content}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Links Section */}
                        {selectedTopic.links && submitStatus === 'idle' && !isSubmitting && (
                            <div className="px-8 pb-8 space-y-3">
                                {selectedTopic.links.map((link, idx) => {
                                    const isInternal = link.url.startsWith('internal:');
                                    const ContentWrapper = isInternal ? 'button' : 'a';
                                    const wrapperProps = isInternal
                                        ? {
                                            onClick: () => {
                                                const targetId = link.url.replace('internal:', '');
                                                const targetTopic = subTopics.find(t => t.id === targetId);
                                                if (targetTopic) setSelectedTopic(targetTopic);
                                            }
                                        }
                                        : {
                                            href: link.url,
                                            target: "_blank",
                                            rel: "noopener noreferrer"
                                        };

                                    return (
                                        <ContentWrapper
                                            key={idx}
                                            {...wrapperProps}
                                            className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 text-[#4A90E2] font-bold hover:bg-blue-100 transition-all group text-left"
                                        >
                                            <span className="flex-1">{link.text}</span>
                                            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </ContentWrapper>
                                    );
                                })}
                            </div>
                        )}

                        {/* Footer button (only if not a form, as form has its own submit) */}
                        {!selectedTopic.isForm && submitStatus === 'idle' && !isSubmitting && (
                            <div className="p-8 pt-0 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent">
                                <button
                                    onClick={resetModal}
                                    className="w-full py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold text-lg hover:bg-gray-200 transition-colors"
                                >
                                    Закрыть
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

// Добавляем анимацию перелива
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .animate-shimmer {
    animation: shimmer 6s linear infinite;
  }
`;
document.head.appendChild(style);
