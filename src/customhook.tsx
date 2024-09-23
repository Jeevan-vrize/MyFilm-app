import { useState, useEffect } from 'react';

const useJeevan = () => {
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};

export default useJeevan;

    