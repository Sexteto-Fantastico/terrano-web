import React from "react";
import { buttonVariants } from "./button";
import { createLink } from "@tanstack/react-router";

interface BasicLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const BasicLinkComponent = React.forwardRef<HTMLAnchorElement, BasicLinkProps>(
  (props, ref) => {
    return (
      <a
        ref={ref}
        {...props}
        className={buttonVariants({
          variant: "link",
          className: props.className,
        })}
      />
    );
  }
);

export const Link = createLink(BasicLinkComponent);
