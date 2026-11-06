import React from "react";
import ReactDOM from "react-dom/client";
import StarterApp from "./workbench/StarterApp";
import "./styles/globals.css";

const PreviewPage = React.lazy(() => import("./workbench/catalog/PreviewPage"));
const PrototypeApp = React.lazy(() => import("./project/PrototypeApp"));
const params = new URLSearchParams(location.search);
const runtime = params.get("prototype") === "starter";
const preview = params.has("preview");
const root = import.meta.hot?.data.root ?? ReactDOM.createRoot(document.getElementById("root")!);
if (import.meta.hot) import.meta.hot.data.root = root;
root.render(<React.StrictMode><React.Suspense fallback={<p role="status">正在加载…</p>}>{runtime ? <PrototypeApp/> : preview ? <PreviewPage/> : <StarterApp/>}</React.Suspense></React.StrictMode>);
