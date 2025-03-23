import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Load YouTube iframe API
const loadYouTubeAPI = () => {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
};

// Load the YouTube API before rendering the app
loadYouTubeAPI();

createRoot(document.getElementById("root")!).render(<App />);
