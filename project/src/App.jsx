import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./pages/Navbar";
import TimezoneConverter from "./pages/TimezoneConverter";
import SplashScreen from "./pages/SplashScreen";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Show splash screen for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {loading ? (
        <SplashScreen />
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<TimezoneConverter />} />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;
