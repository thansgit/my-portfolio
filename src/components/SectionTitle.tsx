interface SectionTitleProps {
  children: React.ReactNode;
}

export const SectionTitle = ({ children }: SectionTitleProps) => {
  return (
    <h2 className="text-2xl font-bold mb-8 text-yellow-500">
      {children}
    </h2>
  );
}; 