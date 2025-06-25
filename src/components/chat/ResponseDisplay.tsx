import { CheckCircle, X } from "lucide-react";

interface ResponseDisplayProps {
  response: string;
  onClose: () => void;
}

export const ResponseDisplay = ({
  response,
  onClose,
}: ResponseDisplayProps) => {
  return (
    <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
            Жоп
          </h3>
          <div className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">
            {response}
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
