/**
 * Acts as a test server for e2e tests.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { JatEditor } from "./jat-editor";

const root = createRoot(document.getElementById("root")!);
root.render(<JatEditor />);
