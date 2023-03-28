// client.tsx
import { React, ReactDOM } from "./dep.ts";

declare global {
  var __INITIAL_STATE__: any;
}
import App from "./app.tsx";
const { games } = window.__INITIAL_STATE__ || { games: [] };
(ReactDOM as any).hydrate(
  <App games={games} />,
  (window as any).document.getElementById("root")
);