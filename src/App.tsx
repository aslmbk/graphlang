import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export const App = () => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (prompt.trim()) {
      console.log("Отправка промпта:", prompt);
      // Здесь будет логика отправки промпта к ИИ
      setPrompt("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Д1алаца хьайна
          </h1>
          <p className="text-muted-foreground text-lg">
            Кхин а дукха схьалацархьама
          </p>
        </div>

        {/* Основная карточка */}
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl p-8">
          {/* Поле ввода */}
          <div className="mb-6">
            <label
              htmlFor="prompt-input"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Промпт ала
            </label>
            <Input
              id="prompt-input"
              type="text"
              placeholder="Масала: Жопдоцу безамах лаьцна мог1анаш дазде..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-12 text-base placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
          </div>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Д1атоха
            </Button>

            <Button
              variant="outline"
              onClick={() => setPrompt("")}
              className="h-12 px-6 border-2 hover:bg-destructive/10 hover:border-destructive/50 transition-all duration-200"
            >
              Горгам хьакха
            </Button>
          </div>

          {/* Дополнительная информация */}
          <div className="mt-6 pt-6 border-t border-border/30">
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Enter т1е п1елг та1бан а мега иштта-м
            </div>
          </div>
        </div>

        {/* Декоративные элементы */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};
