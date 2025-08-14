
import React from 'react'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

interface PropertyImageProps {
  images: string[]
}

export const PropertyImage: React.FC<PropertyImageProps> = ({ images }) => {
  // If no images provided, show placeholder
  const displayImages = images.length > 0 
    ? images.map((url, index) => ({ id: index + 1, url, alt: `Property image ${index + 1}` }))
    : [{ id: 1, url: null, alt: "No image available" }]

  return (
    <div className="mb-12">
      <Carousel className="w-full">
        <CarouselContent>
          {displayImages.map((image) => (
            <CarouselItem key={image.id}>
              <AspectRatio ratio={16 / 9}>
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-muted/40 to-muted/60 rounded-2xl flex items-center justify-center overflow-hidden group"><div class="text-center opacity-60 group-hover:opacity-40 transition-opacity duration-300"><div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"><div class="w-8 h-8 bg-primary/20 rounded-lg"></div></div><p class="text-sm font-medium text-muted-foreground">Image not available</p></div></div>';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-muted/40 to-muted/60 rounded-2xl flex items-center justify-center overflow-hidden group">
                    <div className="text-center opacity-60 group-hover:opacity-40 transition-opacity duration-300">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg"></div>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">{image.alt}</p>
                    </div>
                  </div>
                )}
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
