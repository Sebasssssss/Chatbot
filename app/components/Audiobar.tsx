'use client'
import {
  SoundHigh,
  Pause,
  Play,
  SoundOff,
  Playlist,
  SkipPrev,
  SkipNext,
  Shuffle,
  Repeat,
  RepeatOnce
} from 'iconoir-react'
import { useAudioContext } from '../providers/AppState'
import ChatTrigger from './ChatTrigger'
import { useState } from 'react'
import { cn } from '@/app/lib/utils'

export default function Audiobar() {
  const {
    handleTimeUpdate,
    handleVolumeChange,
    handleVolumeToggle,
    handleSeek,
    currentTime,
    volume,
    handleTogglePlay,
    audioRef,
    pause
  } = useAudioContext()

  const [repeat, setRepeat] = useState(true)
  const [shuffle, setShuffle] = useState(false)

  const handleShuffle = () => {
    setShuffle(!shuffle)
  }

  const handleRepeat = () => {
    setRepeat(!repeat)
  }

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="w-full shados container absolute left-0 right-0 ml-auto mr-auto bottom-6 gap-12 py-6 px-8 bg-white rounded-[10px] z-20">
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate}>
        <source src="likeyou.mp3" type="audio/mpeg" />
      </audio>
      <div className="w-full grid grid-cols-3 gap-8">
        <div />
        <div className="w-full flex flex-col gap-2 items-center justify-center">
          <div className="flex items-center gap-4">
            <Shuffle
              onClick={handleShuffle}
              className={cn(
                'opacity-70 hover:opacity-90 transition-colors duration-300',
                {
                  'opacity-100': shuffle
                }
              )}
            />
            <SkipPrev />
            <button
              type="button"
              onClick={handleTogglePlay}
              className="outline-none"
            >
              {pause ? (
                <Play className="w-8 h-8" />
              ) : (
                <Pause className="w-8 h-8" />
              )}
            </button>
            <SkipNext />
            <button onClick={handleRepeat}>
              {repeat ? (
                <Repeat className="opacity-70 hover:opacity-100 transition-colors duration-300" />
              ) : (
                <RepeatOnce />
              )}
            </button>
          </div>
          <div className="w-full flex items-center gap-2">
            <p className="font-medium text-xs">{formatTime(currentTime)}</p>
            <input
              type="range"
              min="0"
              step="0.1"
              max={audioRef.current?.duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full range-slider appearance-none bg-gray-300 h-1 rounded-lg focus:outline-none focus:bg-gray-500 transition-all duration-300"
            />
            <p className="font-medium text-xs">3:30</p>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <ChatTrigger />
          <button className="disabled:opacity-40" disabled>
            <Playlist />
          </button>
          <button className="z-10" onClick={handleVolumeToggle}>
            {volume === 0 ? <SoundOff /> : <SoundHigh />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 range-slider appearance-none bg-gray-300 h-1 rounded-lg focus:outline-none focus:bg-gray-500 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  )
}
