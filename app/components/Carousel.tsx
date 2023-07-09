import React, { useState, useRef, ReactNode } from 'react'
import { playlists } from '../lib/api-response'
import { Play } from 'iconoir-react'

const MAX_VISIBILITY = 3

interface CarouselProps {
  children: ReactNode
}

const CarouselContent: React.FC<CarouselProps> = ({ children }) => {
  const [active, setActive] = useState(0)
  const count = React.Children.count(children)
  const containerRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef<number>(0)

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    startXRef.current = e.clientX
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    const containerWidth = containerRef.current?.offsetWidth || 0
    const dragDistance = e.clientX - startXRef.current
    const dragRatio = dragDistance / containerWidth

    if (Math.abs(dragRatio) >= 1 / MAX_VISIBILITY) {
      if (dragRatio > 0) {
        setActive(prevActive => Math.max(prevActive - 1, 0))
      } else {
        setActive(prevActive => Math.min(prevActive + 1, count - 1))
      }
      startXRef.current = e.clientX
    }
  }

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      className="carousel relative w-full h-full grid place-items-center"
      ref={containerRef}
    >
      {React.Children.map(children, (child, i) => (
        <div
          className="card-container absolute w-full h-full transition-all duration-300 ease-out"
          style={{
            '--active': String(i === active ? 1 : 0),
            '--offset': String((active - i) / 3),
            '--direction': String(Math.sign(active - i)),
            '--abs-offset': String(Math.abs(active - i) / 3),
            'pointer-events': active === i ? 'auto' : 'none',
            opacity: Math.abs(active - i) >= MAX_VISIBILITY ? '0' : '1',
            display: Math.abs(active - i) > MAX_VISIBILITY ? 'none' : 'block'
          }}
        >
          {React.cloneElement(child as React.ReactElement<any>, {
            onMouseDown: handleMouseDown
          })}
        </div>
      ))}
    </div>
  )
}

const Carousel = () => {
  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault()
  }

  return (
    <div className="w-full h-full">
      <CarouselContent>
        {playlists.map(playlist => (
          <div
            key={playlist.id}
            className="card w-full h-full flex flex-col items-center justify-center gap-2 p-[2rem] transition-all duration-300 ease-out text-black"
          >
            <p className="font-medium">{playlist.name}</p>
            <div className="relative group">
              <div
                className="w-40 h-40 rounded-[10px] albumShadow group-hover:blur-sm group-hover:opacity-90 transition-all duration-300"
                style={{ backgroundImage: `url(${playlist.images[0].url})` }}
                onMouseDown={handleMouseDown}
              />
              <button className="absolute inset-0 flex items-center justify-center invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                <Play className="w-12 h-12" />
              </button>
            </div>
          </div>
        ))}
      </CarouselContent>
    </div>
  )
}

export default Carousel
