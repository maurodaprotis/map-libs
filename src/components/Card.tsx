import { ReactNode } from "react";

const Title = ({ children }: { children: ReactNode }) => {
  return (
    <h1 className="text-neutral-900 font-semibold text-base">{children}</h1>
  );
};

const Root = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col gap-6 w-full">
      {children}
    </div>
  );
};

export const Card = {
  Root,
  Title,
};
