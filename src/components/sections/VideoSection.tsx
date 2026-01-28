import { useRef, useState, useMemo } from 'react';
import { Heading } from '../atoms/Heading';
import { Play } from 'lucide-react';

export const VideoSection = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [videoError, setVideoError] = useState(false);

    // Определяем устройство
    const isIOS = useMemo(() => /iPhone|iPad|iPod/i.test(navigator.userAgent), []);
    const isMobile = useMemo(() => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent), []);

    // Варианты загрузки видео:
    // 1. Для iOS - VITE_VIDEO_URL_IOS (если задано)
    // 2. Для мобильных - VITE_VIDEO_URL_MOBILE (если задано)
    // 3. Общая ссылка - VITE_VIDEO_URL
    // 4. Локальный файл - fallback (/gzp_video.mp4)
    const videoUrl = useMemo(() => {
        if (isIOS && import.meta.env.VITE_VIDEO_URL_IOS) {
            return import.meta.env.VITE_VIDEO_URL_IOS;
        }
        if (isMobile && import.meta.env.VITE_VIDEO_URL_MOBILE) {
            return import.meta.env.VITE_VIDEO_URL_MOBILE;
        }
        return import.meta.env.VITE_VIDEO_URL || '/gzp_video.mp4';
    }, [isIOS, isMobile]);

    const handlePlayClick = () => {
        if (videoRef.current) {
            // Просто показываем контролы и позволяем браузеру самому обработать воспроизведение
            setHasInteracted(true);
            videoRef.current.play().catch(() => {
                // Игнорируем ошибку, пользователь может нажать play на контролах
            });
        }
    };

    const handleVideoEnded = () => {
        setIsPlaying(false);
        setHasInteracted(false); // Возвращаем красивую обложку после окончания
        if (videoRef.current) {
            videoRef.current.load(); // Сбрасываем видео в начало
        }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVideoError = () => {
        setVideoError(true);
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
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    playsInline
                    preload="metadata"
                    controls
                    onEnded={handleVideoEnded}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onError={handleVideoError}
                >
                    {/* Для iOS - явно указываем H.264 кодек */}
                    {isIOS ? (
                        <source src={videoUrl} type="video/mp4; codecs=avc1.42E01E, mp4a.40.2" />
                    ) : (
                        <source src={videoUrl} type="video/mp4" />
                    )}
                </video>
            </div>
        </section>
    );
};
