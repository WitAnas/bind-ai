import { setDarkMode, toggleDarkMode } from "@/redux/reducers/themeReducer";
import { updateUserPreferenceTheme } from "@/redux/reducers/userSubscriptionReducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const preferences = useSelector(
    (state) => state.userSubscription?.preferences
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");

    if (savedTheme === "true") {
      dispatch(setDarkMode(true));
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "false") {
      dispatch(setDarkMode(false));
      document.documentElement.classList.remove("dark");
    }
  }, [dispatch]);

  useEffect(() => {
    if (preferences?.theme) {
      const isDarkTheme = preferences.theme === "Dark";
      const savedTheme = localStorage.getItem("darkMode");

      if (isDarkTheme !== (savedTheme === "true")) {
        dispatch(setDarkMode(isDarkTheme));
        if (isDarkTheme) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("darkMode", "true");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("darkMode", "false");
        }
      }
    }
  }, [dispatch, preferences?.theme]);

  const handleToggle = () => {
    const newDarkMode = !darkMode;
    dispatch(toggleDarkMode());

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      // localStorage.setItem("darkMode", "true");
      // dispatch(updateUserPreferenceTheme("Dark"));
    } else {
      document.documentElement.classList.remove("dark");
      // localStorage.setItem("darkMode", "false");
      // dispatch(updateUserPreferenceTheme("Light"));
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors mr-3 ${
        !darkMode ? "bg-gray-800" : "bg-gray-200"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full shadow-md transform transition-transform ${
          darkMode ? "translate-x-6 bg-gray-800" : "translate-x-0 bg-white"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
