import { ReactNode } from "react";
import { Navigation } from "./Navigation";

export const Layout = ({
  children,
  title,
  url,
}: {
  children: ReactNode;
  title: string;
  url?: string;
}) => {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <div className="flex w-full">
        <Navigation />
        <div className="max-w-7xl mx-auto min-h-screen mt-12 w-full px-12 space-y-8 flex-1">
          <div className="flex items-baseline gap-4 mx-auto w-fit">
            <h1 className="text-center text-2xl">{title}</h1>
            {url && (
              <a
                href={url}
                target="_blank"
                className="text-blue-600"
                rel="noreferrer"
              >
                site ↗
              </a>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
