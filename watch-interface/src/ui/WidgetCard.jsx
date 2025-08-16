import React from 'react';

const WidgetCard = ({ 
  icon: Icon, 
  title, 
  value, 
  unit, 
  gradient = "from-gray-500/20 to-gray-600/20",
  borderColor = "border-gray-500/40",
  iconColor = "text-gray-400",
  valueColor = "text-gray-400",
  onClick,
  className = "",
  size = "normal" // "normal", "large", "small"
}) => {
  const sizeClasses = {
    small: "p-2",
    normal: "p-3", 
    large: "p-4"
  };

  const iconSizes = {
    small: 10,
    normal: 12,
    large: 16
  };

  const textSizes = {
    small: "text-sm",
    normal: "text-lg", 
    large: "text-xl"
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br ${gradient} border ${borderColor} backdrop-blur-sm transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-2 mb-1">
        <Icon size={iconSizes[size]} className={iconColor} />
        <span className="text-xs text-white font-semibold">{title}</span>
      </div>
      <div className={`${textSizes[size]} font-bold ${valueColor}`}>{value}</div>
      {unit && <div className="text-xs text-gray-300">{unit}</div>}
    </div>
  );
};

export default WidgetCard;