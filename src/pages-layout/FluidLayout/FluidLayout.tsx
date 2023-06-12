import type { CustomLayout } from "next";

import { Footer } from "../Footer";
import { Header } from "../Header";
import { LayoutErrorBoundary } from "../LayoutErrorBoundary";

/** @package */
export const FluidLayout: CustomLayout = (page) => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-cyan-9">
        <Header />
      </header>
      <main className="flex-1 bg-cyan-2">
        <LayoutErrorBoundary>{page}</LayoutErrorBoundary>
      </main>
      <footer className="bg-cyan-9">
        <Footer />
      </footer>
    </div>
  );
};
