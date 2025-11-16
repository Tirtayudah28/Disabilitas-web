// src/contexts/SearchContext.js
import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  const markAsSearched = (query = '') => {
    setHasSearched(true);
    setLastSearchQuery(query);
  };

  const resetSearch = () => {
    setHasSearched(false);
    setLastSearchQuery('');
  };

  const value = {
    hasSearched,
    lastSearchQuery,
    markAsSearched,
    resetSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};