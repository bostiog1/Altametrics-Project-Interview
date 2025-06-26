interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "text-white",
}) => {
  const spinnerSize = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-8 h-8",
  }[size];

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${spinnerSize} ${color}`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
