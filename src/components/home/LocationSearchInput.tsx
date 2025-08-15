import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const UK_LOCATIONS = [
  'London',
  'Manchester',
  'Birmingham',
  'Liverpool',
  'Leeds',
  'Sheffield',
  'Bristol',
  'Glasgow',
  'Edinburgh',
  'Cardiff',
  'Brighton',
  'Oxford',
  'Cambridge',
  'Newcastle',
  'Nottingham',
  'Leicester',
  'Southampton',
  'Portsmouth',
  'Reading',
  'Coventry',
  'York',
  'Bath',
  'Canterbury',
  'Exeter',
  'Plymouth',
  'Aberdeen',
  'Dundee',
  'Swansea',
  'Belfast'
];

interface LocationSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  className?: string;
}

export const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  value,
  onChange,
  onSearch,
  className
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (location: string) => {
    onChange(location);
    setOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setOpen(false);
      onSearch();
    }
  };

  const filteredLocations = UK_LOCATIONS.filter(location =>
    location.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative", className)}>
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5 z-10" />
          <input
            type="text"
            placeholder="Where do you want to live?"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setOpen(true)}
            className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-muted focus:border-primary focus:ring-primary bg-white w-full outline-none"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-0 bg-white border border-border shadow-lg" 
        align="start"
        side="bottom"
        sideOffset={4}
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <Command>
          <CommandList className="max-h-[200px]">
            <CommandEmpty>No locations found.</CommandEmpty>
            <CommandGroup>
              {filteredLocations.map((location) => (
                <CommandItem
                  key={location}
                  value={location}
                  onSelect={() => handleSelect(location)}
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  {location}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};