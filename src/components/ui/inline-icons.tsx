import React from "react";

interface InlineIconsProps {
  icons: React.ReactNode[];
  className?: string;
}

const InlineIcons: React.FC<InlineIconsProps> = ({ icons, className }) => {
  return (
    <span className={"inline-flex items-center gap-1 text-[0.85rem] " + (className || "") }>
      {icons.map((icon, idx) => (
        <span key={idx} className="inline-flex items-center">
          {icon}
        </span>
      ))}
    </span>
  );
};

export default InlineIcons; 