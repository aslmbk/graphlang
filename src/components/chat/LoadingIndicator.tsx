export const LoadingIndicator = () => {
  return (
    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-blue-700 dark:text-blue-300">
          Жоьпалле озина...
        </span>
      </div>
    </div>
  );
};
