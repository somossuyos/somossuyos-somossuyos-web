import React from 'react';

interface TruncatedTextProps {
  text: string;
  maxLines?: number;
  className?: string;
  showTooltip?: boolean;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxLines = 3,
  className = '',
  showTooltip = true
}) => {
  return (
    <p
      className={className}
      style={{
        display: '-webkit-box',
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: '1.2',
        maxHeight: `calc(1.2em * ${maxLines})`
      }}
      title={showTooltip ? text : undefined}
    >
      {text}
    </p>
  );
};

export default TruncatedText;
