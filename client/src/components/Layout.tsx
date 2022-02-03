import React from "react";
import { NavBar } from "./NavBar";
import Wrapper, { WrapperVariant } from "./Wrapper";

interface LayoutProps {
  variant?: WrapperVariant;
  children: React.ReactNode;
}

export default function Layout({ variant, children }: LayoutProps) {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
}
