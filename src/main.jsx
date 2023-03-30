import { createRoot } from "react-dom/client";
import Counter from "./App";
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<Counter />);