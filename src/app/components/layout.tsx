import React, { isValidElement } from "react";

interface LayoutProps {
  avatar?: React.ReactNode;
}

export default function Layout(props: React.PropsWithChildren<LayoutProps>) {
  const { children, avatar } = props;

  return (
    <div className="relative h-full">
      {children}
      {isValidElement(avatar) && (
        <div className="absolute top-2.5 right-5 w-[60px] h-[60px] leading-[60px] text-center rounded-full">
          {avatar}
        </div>
      )}
    </div>
  );
}
