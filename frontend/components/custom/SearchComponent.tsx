'use client';

import React, { useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, X } from 'lucide-react';

interface SearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchComponent: React.FC<SearchProps> = React.memo(({ searchTerm, setSearchTerm }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input on the initial render
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  console.log('SearchComponent rerendered'); // Debug to check rerender

  return (
    <div className="relative flex-1 max-w-sm">
      <Input
        ref={inputRef}
        placeholder="Search bookmarks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-4 py-2 w-full"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      {searchTerm && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={() => setSearchTerm('')}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
});

// Adding a display name for easier debugging
SearchComponent.displayName = 'SearchComponent';

export default SearchComponent;
