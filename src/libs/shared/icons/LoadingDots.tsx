const LoadingDots = () => {
  return (
    <div className="flex space-x-2 w-full justify-center">
      <span className="sr-only">Loading...</span>
      <div className="h-2 w-2 bg-[#bae7ff] rounded-full animate-bounce [animation-delay:-0.2s]" />
      <div className="h-2 w-2 bg-[#bae7ff] rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="h-2 w-2 bg-[#bae7ff] rounded-full animate-bounce" />
    </div>

  );
};

export default LoadingDots;
