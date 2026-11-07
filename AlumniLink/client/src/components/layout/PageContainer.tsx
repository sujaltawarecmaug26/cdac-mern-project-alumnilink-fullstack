export function PageContainer({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8 ${className}`}>
      {children}
    </div>
  );
}
