import React from 'react';

const GenreSelector = ({ selectedGenres, onGenreChange }) => {
  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Thriller',
    'Romance', 'Sci-Fi', 'Fantasy', 'Mystery', 'Crime', 'Documentary',
    'Animation', 'Musical', 'Western', 'War', 'Biography', 'History',
    'Sport', 'Family', 'Superhero', 'Indie', 'Foreign', 'Art House'
  ];

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      onGenreChange(selectedGenres.filter(g => g !== genre));
    } else {
      onGenreChange([...selectedGenres, genre]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => toggleGenre(genre)}
          className={`p-3 rounded-lg border transition-all duration-200 ${
            selectedGenres.includes(genre)
              ? 'bg-primary text-white border-primary'
              : 'bg-gray-800 text-dark-text-primary border-gray-700 hover:border-primary/50'
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default GenreSelector;