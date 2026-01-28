import { useState } from 'react';
import { Heading } from '../atoms/Heading';
import { Play } from 'lucide-react';

export const VideoSection = () => {
    const [hasInteracted, setHasInteracted] = useState(false);

    // URL видео - можно использовать Rutube, YouTube, или прямую ссылку
    // Приоритет: переменная окружения > Rutube ID > прямая ссылка
    // 
    // Варианты:
    // - Rutube: используйте ID видео (например: "f5820e2c7f383616a69ea94fe8200ea7")
    // - Для приватных видео может понадобиться параметр доступа
    // - Прямая ссылка: https://example.com/video.mp4
    const rutubeVideoId = import.meta.env.VITE_RUTUBE_VIDEO_ID || 
                          'f5820e2c7f383616a69ea94fe8200ea7';
    const rutubeAccessKey = import.meta.env.VITE_RUTUBE_ACCESS_KEY || 
                            'Qkzc3ZwqIi3lRrqw7QKqWQ'; // Параметр доступа для приватного видео
    const directVideoUrl = import.meta.env.VITE_VIDEO_URL || null;

    // Определяем тип видео
    const useRutube = rutubeVideoId && rutubeVideoId.length > 10; // Проверяем, что ID не пустой
    // Для Rutube используем формат embed с параметром доступа для приватных видео
    // Формат: https://rutube.ru/play/embed/VIDEO_ID?p=ACCESS_KEY
    const rutubeEmbedUrl = useRutube 
        ? `https://rutube.ru/play/embed/${rutubeVideoId}?p=${rutubeAccessKey}`
        : null;

    const handlePlayClick = () => {
        setHasInteracted(true);
    };

    return (
        <section className="px-6 py-12 relative">
            <Heading level={2} className="mb-8 text-center">
                Мы сняли фильм про нашу Молодежку! <br />
                <span className="text-[#4A90E2]">Они уже с нами!</span>
            </Heading>

            <div
                className="relative w-full aspect-video bg-black rounded-[32px] overflow-hidden shadow-[0_30px_90px_-10px_rgba(74,144,226,0.7)] border-4 border-white/20 group hover:shadow-[0_40px_110px_-10px_rgba(74,144,226,0.8)] transition-all duration-300"
            >
                {useRutube && rutubeEmbedUrl ? (
                    // Rutube через iframe
                    <>
                        {!hasInteracted ? (
                            // Обложка с кнопкой Play
                            <div
                                className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/30 transition-colors z-10"
                                onClick={handlePlayClick}
                            >
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 shadow-lg group-hover:scale-110 transition-transform">
                                    <Play className="w-8 h-8 text-white fill-white translate-x-1" />
                                </div>
                            </div>
                        ) : null}
                        <iframe
                            src={hasInteracted ? rutubeEmbedUrl : undefined}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ border: 'none' }}
                        />
                    </>
                ) : directVideoUrl ? (
                    // Прямая ссылка на видео
                    <>
                        {!hasInteracted ? (
                            <div
                                className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/30 transition-colors z-10"
                                onClick={handlePlayClick}
                            >
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 shadow-lg group-hover:scale-110 transition-transform">
                                    <Play className="w-8 h-8 text-white fill-white translate-x-1" />
                                </div>
                            </div>
                        ) : null}
                        <video
                            src={directVideoUrl}
                            className="w-full h-full object-contain"
                            playsInline
                            controls={hasInteracted}
                            autoPlay={hasInteracted}
                        />
                    </>
                ) : (
                    // Если ничего не настроено, не показываем секцию
                    null
                )}
            </div>
        </section>
    );
};
