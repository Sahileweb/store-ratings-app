import { useState } from 'react';

export default function StarRating({ value, onChange, disabled }) {
  const [hovered, setHovered] = useState(0);
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating">
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= (hovered || value) ? 'filled' : ''}`}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => !disabled && setHovered(0)}
          onClick={() => !disabled && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
