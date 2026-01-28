import { useRef, useState } from 'react';
import { Heading } from '../atoms/Heading';
import { Play } from 'lucide-react';

export const VideoSection = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [videoError, setVideoError] = useState(false);

    // Локальный файл видео (только для стационарного сервера)
    const videoUrl = '/gzp_video.mp4';

    const handlePlayClick = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {
                setVideoError(true);
            });
            setHasInteracted(true);
            setIsPlaying(true);
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
        console.warn('Видео не загрузилось. Проверьте URL или загрузите файл на хостинг.');
    };

    // Если видео недоступно, не показываем секцию
    if (videoError && videoUrl === '/gzp_video.mp4') {
        return null;
    }

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
                    className={`w-full h-full ${hasInteracted ? 'object-contain' : 'object-cover'}`}
                    playsInline
                    controls={hasInteracted} // Включаем нативные контролы только после нажатия Play
                    onEnded={handleVideoEnded}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onError={handleVideoError}
                />

                {/* Custom Play Overlay - показываем только пока не начали взаимодействие */}
                {!hasInteracted && (
                    <div
                        className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/30 transition-colors"
                        onClick={handlePlayClick}
                    >
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-white fill-white translate-x-1" />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
