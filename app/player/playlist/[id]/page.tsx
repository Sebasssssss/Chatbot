'use client'
import Image from 'next/image'
import background from '@/public/background.png'
import ListOfSongs from '../../../components/ListOfSongs'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Playlist, Songs, playlists } from '@/app/lib/api-response'
import { Play, Pause, SkipNext, SkipPrev } from 'iconoir-react'
import { useAudioContext } from '@/app/providers/AppState'
import LikeButton from '@/app/components/LikeButton'

export default function Player() {
  const { handleTogglePlay, pause } = useAudioContext()
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const value = pathname.split('/').pop()
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  )

  const playlist = playlists.find(playlist => playlist.id === value)
  useEffect(() => {
    if (playlist) {
      setSelectedPlaylist(playlist)
    }
  }, [playlist])

  return (
    <div className="overflow-hidden w-full h-screen">
      <div className="flex flex-col lg:flex-row h-screen items-center justify-center w-full gap-2">
        <Image
          alt="albumCover background"
          src={selectedPlaylist?.images[0]?.url || ''}
          width={100}
          height={100}
          className="not-selectable opacity-80 -z-20 w-screen h-screen absolute ml-auto mr-auto right-0 left-0 bottom-[128px] text-center"
        />
        <Image
          alt="white background"
          src={background}
          width={100}
          height={100}
          className="not-selectable -z-20 opacity-95 w-screen h-screen absolute ml-auto mr-auto right-0 left-0 text-center"
        />
        <div className="absolute top-0 left-0 w-full h-screen backdrop-blur-xl bg-white/20 -z-10"></div>
        <div
          onClick={handleTogglePlay}
          className="flex flex-col items-center mx-12 relative group cursor-pointer"
        >
          <Image
            alt="albumCover"
            src={selectedPlaylist?.images[0]?.url || ''}
            width={400}
            height={400}
            className={`${
              isLoading ? 'grayscale blur-sm' : 'grayscale-0 blur-0'
            } duration-300 ease-in-out rounded-[32px] aspect-square z-10 not-selectable group-hover:grayscale group-hover:opacity-90`}
            onLoadingComplete={() => setIsLoading(false)}
          />
          <Image
            alt="albumCover Shadow"
            src={selectedPlaylist?.images[0]?.url || ''}
            width={400}
            height={400}
            className={`${
              isLoading ? 'grayscale blur-sm' : 'grayscale-0 blur-0'
            } duration-300 ease-in-out rounded-[32px] not-selectable aspect-square absolute bottom-0 blur-2xl opacity-60`}
            onLoadingComplete={() => setIsLoading(false)}
          />
          <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-max opacity-0 group-hover:opacity-100 z-20 transition-opacity duration-300">
            {pause ? (
              <Play className="w-32 h-32" />
            ) : (
              <Pause className="w-32 h-32" />
            )}
          </button>
        </div>
        <div className="flex flex-col">
          <div className="flex w-full justify-between py-4 px-6">
            <h1 className="text-xl font-bold flex flex-col">
              {decodeURI(selectedPlaylist?.name)}
              <span className="text-xs">
                {selectedPlaylist?.description}
                <br /> 2018 • {Songs.length} songs
              </span>
            </h1>
            <LikeButton />
          </div>
          <ListOfSongs />
        </div>
      </div>
    </div>
  )
}
