import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
  Sparkles,
  Wind,
  Waves,
  Droplets,
  CloudRain,
  Music,
  Headphones,
  Sliders,
  Check,
} from 'lucide-react';

export interface AudioTrack {
  id: string;
  title: string;
  category: 'nature' | 'guided';
  description: string;
  src: string;
  icon: string;
  tag: string;
  durationFormatted: string;
}

export const CALM_TRACKS: AudioTrack[] = [
  {
    id: 'rain',
    title: 'Gentle Forest Rain',
    category: 'nature',
    description: 'Soft, continuous rain to soften physical tension and soothe cognitive overload.',
    src: '/audio/nature_gentle_rain.wav',
    icon: '🌧️',
    tag: 'Nature Sound',
    durationFormatted: '0:12 (Seamless)',
  },
  {
    id: 'ocean',
    title: 'Deep Ocean Waves',
    category: 'nature',
    description: 'Rhythmic oceanic surge that naturally stabilizes your pulse and breathing rhythm.',
    src: '/audio/nature_ocean_waves.wav',
    icon: '🌊',
    tag: 'Nature Sound',
    durationFormatted: '0:12 (Seamless)',
  },
  {
    id: 'brook',
    title: 'Mountain Forest Brook',
    category: 'nature',
    description: 'Clear, babbling stream trickles designed to quiet racing thoughts while revising.',
    src: '/audio/nature_mountain_brook.wav',
    icon: '💧',
    tag: 'Nature Sound',
    durationFormatted: '0:10 (Seamless)',
  },
  {
    id: 'breathing',
    title: '4-4-4 Box Breathing Guide',
    category: 'guided',
    description: 'Warm harmonic drone with singing-bowl cues for Inhale (4s), Hold (4s), & Exhale (4s).',
    src: '/audio/guided_breathing_4_4_4.wav',
    icon: '🌬️',
    tag: 'Guided Breathing',
    durationFormatted: '0:12 (Cycle)',
  },
  {
    id: 'solfeggio',
    title: 'Solfeggio 528Hz Harmonic Rest',
    category: 'guided',
    description: 'Restorative frequency with subtle 6Hz delta relaxation pulse to ease acute anxiety.',
    src: '/audio/solfeggio_528hz_calm.wav',
    icon: '✨',
    tag: 'Sound Meditation',
    durationFormatted: '0:10 (Resonance)',
  },
];

interface CalmAudioPlayerProps {
  onTrackChange?: (track: AudioTrack) => void;
  activeBreathingGuide?: boolean;
}

export const CalmAudioPlayer: React.FC<CalmAudioPlayerProps> = ({
  onTrackChange,
  activeBreathingGuide,
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'nature' | 'guided'>('all');
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = CALM_TRACKS[currentTrackIndex];

  // Update track
  const selectTrack = (index: number, autoPlay: boolean = true) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    if (onTrackChange) {
      onTrackChange(CALM_TRACKS[index]);
    }

    if (audioRef.current) {
      audioRef.current.src = CALM_TRACKS[index].src;
      audioRef.current.load();
      if (autoPlay) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      }
    }
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % CALM_TRACKS.length;
    selectTrack(nextIndex, isPlaying);
  };

  const handlePrev = () => {
    const prevIndex = (currentTrackIndex - 1 + CALM_TRACKS.length) % CALM_TRACKS.length;
    selectTrack(prevIndex, isPlaying);
  };

  // Time seeker
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Volume change
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handlePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // Audio lifecycle event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 12);
    };

    const onEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNext();
      }
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    // Initial setup
    audio.volume = isMuted ? 0 : volume;
    audio.loop = isLooping;

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [isLooping, isMuted, volume]);

  const formatSeconds = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const filteredTracks = CALM_TRACKS.filter((t) =>
    selectedFilter === 'all' ? true : t.category === selectedFilter
  );

  return (
    <div className="bg-white dark:bg-[#0D1E2D] rounded-3xl p-6 border border-[#B2CBD8]/60 dark:border-[#1E3A52] shadow-sm space-y-6">
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="auto"
        loop={isLooping}
      />

      {/* Header & Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎧</span>
            <h2 className="text-lg font-bold text-[#0F3A57] dark:text-[#F0F7FB]">
              Embedded Soothing Audio Player
            </h2>
          </div>
          <p className="text-xs text-[#547489] dark:text-[#8DAEC2] mt-0.5">
            Calming nature sounds and guided breathing tracks playing directly from local assets.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#EFF9FD] dark:bg-[#122538] border border-[#B2CBD8]/40 dark:border-[#1E3A52] self-start sm:self-auto">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === 'all'
                ? 'bg-[#0F3A57] text-white shadow-xs'
                : 'text-[#547489] dark:text-[#8DAEC2] hover:text-[#0F3A57] dark:hover:text-white'
            }`}
          >
            All Tracks ({CALM_TRACKS.length})
          </button>
          <button
            onClick={() => setSelectedFilter('nature')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === 'nature'
                ? 'bg-[#0F3A57] text-white shadow-xs'
                : 'text-[#547489] dark:text-[#8DAEC2] hover:text-[#0F3A57] dark:hover:text-white'
            }`}
          >
            Nature Sounds
          </button>
          <button
            onClick={() => setSelectedFilter('guided')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === 'guided'
                ? 'bg-[#0F3A57] text-white shadow-xs'
                : 'text-[#547489] dark:text-[#8DAEC2] hover:text-[#0F3A57] dark:hover:text-white'
            }`}
          >
            Guided Breathing
          </button>
        </div>
      </div>

      {/* Embedded Main Player Console */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#EFF9FD] via-[#F4FAFD] to-[#E5F2F8] dark:from-[#102436] dark:via-[#0F283C] dark:to-[#0B1E2E] border border-[#B2CBD8]/70 dark:border-[#1E3A52] shadow-inner space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Current Track Info & Visualizer */}
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl bg-[#0F3A57] dark:bg-[#19405E] text-white flex items-center justify-center text-2xl shadow-md shrink-0">
              <span>{currentTrack.icon}</span>
              {/* Active Soundwave Indicator */}
              {isPlaying && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0D1E2D] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-[#B2CBD8]/50 dark:bg-[#1E3A52] text-[#0F3A57] dark:text-[#B4D5E8]">
                  {currentTrack.tag}
                </span>
                {isPlaying && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Now Playing
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-[#0F3A57] dark:text-[#F0F7FB] mt-0.5">
                {currentTrack.title}
              </h3>
              <p className="text-xs text-[#547489] dark:text-[#8DAEC2] line-clamp-1">
                {currentTrack.description}
              </p>
            </div>
          </div>

          {/* Audio Visualizer Bars Animation */}
          <div className="flex items-end gap-1 h-8 px-3 py-1 bg-white/70 dark:bg-[#08121A]/70 rounded-xl border border-[#B2CBD8]/40 dark:border-[#1E3A52] self-start sm:self-auto shrink-0">
            {[40, 75, 55, 90, 60, 85, 45, 95, 65, 50].map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying
                    ? 'bg-[#0F3A57] dark:bg-[#8EAEC2]'
                    : 'bg-[#B2CBD8] dark:bg-[#1E3A52]'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, (h * ((i % 3) + 1)) % 100)}%` : '20%',
                  animation: isPlaying
                    ? `pulse ${0.6 + (i % 4) * 0.2}s ease-in-out infinite alternate`
                    : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar & Scrubber */}
        <div className="space-y-1.5">
          <div className="relative">
            <input
              type="range"
              min="0"
              max={duration || 12}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 rounded-lg bg-[#B2CBD8]/50 dark:bg-[#1E3A52] accent-[#0F3A57] dark:accent-[#8EAEC2] cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#547489] dark:text-[#8DAEC2]">
            <span>{formatSeconds(currentTime)}</span>
            <span className="flex items-center gap-1 text-[10px] font-sans">
              <span>{isLooping ? 'Continuous loop' : 'Single play'}</span>
              <span>•</span>
              <span>{formatSeconds(duration || 12)}</span>
            </span>
          </div>
        </div>

        {/* Player Transport Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          {/* Main Controls: Previous, Play/Pause, Next */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-xl bg-white dark:bg-[#122538] border border-[#B2CBD8]/60 dark:border-[#1E3A52] text-[#0F3A57] dark:text-[#F0F7FB] flex items-center justify-center hover:bg-[#EFF9FD] dark:hover:bg-[#1C3549] transition-all active:scale-95 shadow-xs"
              title="Previous track"
              aria-label="Previous track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="px-5 py-2.5 rounded-2xl bg-[#0F3A57] hover:bg-[#234C68] text-white flex items-center gap-2 font-bold text-xs shadow-md shadow-[#0F3A57]/20 transition-all active:scale-95"
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white ml-0.5" /> Play
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-xl bg-white dark:bg-[#122538] border border-[#B2CBD8]/60 dark:border-[#1E3A52] text-[#0F3A57] dark:text-[#F0F7FB] flex items-center justify-center hover:bg-[#EFF9FD] dark:hover:bg-[#1C3549] transition-all active:scale-95 shadow-xs"
              title="Next track"
              aria-label="Next track"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Loop Toggle */}
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isLooping
                  ? 'bg-[#0F3A57] text-white shadow-xs'
                  : 'bg-white dark:bg-[#122538] text-[#547489] dark:text-[#8DAEC2] border border-[#B2CBD8]/50 dark:border-[#1E3A52]'
              }`}
              title={isLooping ? 'Looping enabled' : 'Looping disabled'}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Loop</span>
            </button>
          </div>

          {/* Volume & Speed Controls */}
          <div className="flex items-center gap-3">
            {/* Speed Pills */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#122538] p-1 rounded-xl border border-[#B2CBD8]/50 dark:border-[#1E3A52]">
              {[0.75, 1, 1.25].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handlePlaybackRate(rate)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                    playbackRate === rate
                      ? 'bg-[#0F3A57] text-white'
                      : 'text-[#547489] dark:text-[#8DAEC2] hover:text-[#0F3A57]'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#122538] px-3 py-1.5 rounded-xl border border-[#B2CBD8]/50 dark:border-[#1E3A52]">
              <button
                onClick={toggleMute}
                className="text-[#547489] dark:text-[#8DAEC2] hover:text-[#0F3A57] dark:hover:text-white"
                aria-label="Mute / unmute"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolume}
                className="w-16 h-1.5 rounded-lg bg-[#B2CBD8]/50 dark:bg-[#1E3A52] accent-[#0F3A57] dark:accent-[#8EAEC2] cursor-pointer"
                title="Volume"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB] flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-[#547489] dark:text-[#8DAEC2]" />
            Local Audio Tracklist
          </span>
          <span className="text-[11px] text-[#547489] dark:text-[#8DAEC2]">
            Local Offline Storage • Zero Network Telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredTracks.map((track) => {
            const isCurrent = currentTrack.id === track.id;
            const originalIndex = CALM_TRACKS.findIndex((t) => t.id === track.id);

            return (
              <div
                key={track.id}
                onClick={() => selectTrack(originalIndex, true)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  isCurrent
                    ? 'bg-[#EFF9FD] dark:bg-[#102436] border-[#0F3A57] dark:border-[#547489] ring-1 ring-[#0F3A57]/30 shadow-xs'
                    : 'bg-white dark:bg-[#0A1722] border-[#B2CBD8]/60 dark:border-[#1E3A52] hover:border-[#547489] hover:bg-[#EFF9FD]/40 dark:hover:bg-[#122538]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 mt-0.5 ${
                      isCurrent
                        ? 'bg-[#0F3A57] text-white shadow-xs'
                        : 'bg-[#EFF9FD] dark:bg-[#1C3549]'
                    }`}
                  >
                    <span>{track.icon}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB]">
                        {track.title}
                      </h4>
                      {isCurrent && isPlaying && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                          Playing
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#547489] dark:text-[#8DAEC2] line-clamp-2 mt-0.5 leading-snug">
                      {track.description}
                    </p>
                    <div className="text-[10px] text-[#6E8C9F] dark:text-[#547489] mt-1 font-mono">
                      {track.durationFormatted}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCurrent) {
                        togglePlay();
                      } else {
                        selectTrack(originalIndex, true);
                      }
                    }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isCurrent && isPlaying
                        ? 'bg-[#0F3A57] text-white shadow-xs'
                        : 'bg-[#EFF9FD] dark:bg-[#1C3549] text-[#0F3A57] dark:text-[#8DAEC2] hover:bg-[#B2CBD8]/50'
                    }`}
                    aria-label={isCurrent && isPlaying ? 'Pause track' : 'Play track'}
                  >
                    {isCurrent && isPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
