import { Header } from "./Header";
import { BackgroundDecorations } from "./BackgroundDecorations";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Header />
        {children}
        <BackgroundDecorations />
      </div>
    </div>
  );
};
