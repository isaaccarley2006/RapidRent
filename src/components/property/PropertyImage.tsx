
import React from 'react'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export const PropertyImage: React.FC = () => {
  // Placeholder images - in a real app these would come from props
  const images = [
    { id: 1, alt: "Property exterior" },
    { id: 2, alt: "Living room" },
    { id: 3, alt: "Kitchen" },
    { id: 4, alt: "Bedroom" },
    { id: 5, alt: "Bathroom" },
  ]

  return (
    <div className="mb-12">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <AspectRatio ratio={16 / 9}>
                <div className="w-full h-full bg-gradient-to-br from-muted/40 to-muted/60 rounded-2xl flex items-center justify-center overflow-hidden group">
                  <div className="text-center opacity-60 group-hover:opacity-40 transition-opacity duration-300">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg"></div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{image.alt}</p>
                  </div>
                </div>
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-background/80 backdrop-blur-sm border-0 shadow-lg hover:bg-background/90" />
        <CarouselNext className="right-4 bg-background/80 backdrop-blur-sm border-0 shadow-lg hover:bg-background/90" />
      </Carousel>
    </div>
  )
}
