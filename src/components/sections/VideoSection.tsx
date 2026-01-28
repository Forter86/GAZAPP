import { useState } from 'react';
import { Heading } from '../atoms/Heading';
import { Play } from 'lucide-react';

export const VideoSection = () => {
    const [hasInteracted, setHasInteracted] = useState(false);

    // URL видео - можно использовать прямую ссылку или YouTube/Vimeo
    // Приоритет: переменная окружения > прямая ссылка > YouTube/Vimeo
    // 
    // Варианты хранилищ с прямой ссылкой (лучшее качество):
    // - Dropbox: https://www.dropbox.com/s/xxx/video.mp4?raw=1
    // - Mega.nz: получите прямую ссылку
    // - Яндекс.Диск: получите прямую ссылку
    // - Облако Mail.ru: получите прямую ссылку
    // - Любой файловый хостинг с прямой ссылкой
    // 
    // Рекомендуется: Dropbox или Mega.nz (проще всего получить прямую ссылку)
    
    // Прямая ссылка на видео (лучший вариант для качества - без сжатия)
    // Для Яндекс.Диска используйте формат: https://disk.yandex.ru/i/ID_ФАЙЛА
    // Или прямую ссылку через getfile: https://getfile.dokpub.com/yandex/get/https://disk.yandex.ru/i/ID_ФАЙЛА
    const directVideoUrl = import.meta.env.VITE_VIDEO_URL || 
                          'https://getfile.dokpub.com/yandex/get/https://disk.yandex.ru/i/OD4xKAP1UX2-VQ';
    
    // YouTube (если нужен их интерфейс)
    const youtubeVideoId = import.meta.env.VITE_YOUTUBE_VIDEO_ID || null;
    
    // Vimeo (если нужен их интерфейс)
    const vimeoVideoId = import.meta.env.VITE_VIMEO_VIDEO_ID || null;

    // Определяем тип видео (приоритет: прямая ссылка > YouTube > Vimeo)
    const useDirectVideo = directVideoUrl && directVideoUrl !== 'https://ВАША_ПРЯМАЯ_ССЫЛКА_НА_ВИДЕО.mp4';
    const useYouTube = !useDirectVideo && youtubeVideoId && youtubeVideoId.length > 5;
    const useVimeo = !useDirectVideo && !useYouTube && vimeoVideoId && vimeoVideoId.length > 3;
    
    const youtubeEmbedUrl = useYouTube 
        ? `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`
        : null;
        
    const vimeoEmbedUrl = useVimeo 
        ? `https://player.vimeo.com/video/${vimeoVideoId}?autoplay=1&title=0&byline=0&portrait=0`
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
                {useDirectVideo && directVideoUrl ? (
                    // Прямая ссылка на видео (лучшее качество, без сжатия)
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
                            preload="metadata"
                        />
                    </>
                ) : useYouTube && youtubeEmbedUrl ? (
                    // YouTube через iframe (лучшее качество)
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
                        <iframe
                            src={hasInteracted ? youtubeEmbedUrl : undefined}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ border: 'none' }}
                        />
                    </>
                ) : useVimeo && vimeoEmbedUrl ? (
                    // Vimeo через iframe (хорошее качество)
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
                        <iframe
                            src={hasInteracted ? vimeoEmbedUrl : undefined}
                            className="w-full h-full"
                            allow="autoplay; fullscreen"
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
