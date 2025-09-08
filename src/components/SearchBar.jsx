import React from 'react';
import { Search, Sparkles } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors duration-200"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
    </div>
  );
};

export default SearchBar;