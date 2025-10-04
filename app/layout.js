import { Outfit } from "next/font/google";
import "./globals.css";
import { Provider } from "./services/provider";
import ClerkProviderWrapper from "./services/ClerkProviderWrapper";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "AI Notes Maker",
  description: "Generate notes with the power of AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=upload_file"
        />
      </head>
      <body className={`${outfit.className} antialiased`}>
        <ClerkProviderWrapper>
          <Provider>{children}</Provider>
          <Toaster
            position="top-right"
            offset={65}
            toastOptions={{
              classNames: {
                toast: "!bg-white shadow-lg border border-gray-200 text-black",
              },
            }}
          />
        </ClerkProviderWrapper>
      </body>
    </html>
  );
}
