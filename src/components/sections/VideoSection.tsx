import { useRef, useState } from 'react';
import { Heading } from '../atoms/Heading';
import { Play } from 'lucide-react';

export const VideoSection = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [videoError, setVideoError] = useState(false);

    // Два способа загрузки видео:
    // 1. Ссылка с GitHub (или любая прямая ссылка) - установи переменную VITE_VIDEO_URL в Vercel
    // 2. Локальный файл - fallback для стационарного сервера (/gzp_video.mp4)
    const videoUrl = import.meta.env.VITE_VIDEO_URL || '/gzp_video.mp4';

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
                    src={videoUrl}
                    className="w-full h-full object-contain"
                    playsInline
                    preload="metadata"
                    controls
                    onEnded={handleVideoEnded}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onError={handleVideoError}
                />
            </div>
        </section>
    );
};
