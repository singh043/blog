import { useSelector } from "react-redux";

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div className={theme}>
      <div className="dark:text-gray-200 dark:bg-[rgb(16,23,42)] bg-white text-gray-700 select-none min-h-screen">
        {children}
      </div>
    </div>
  );
}
