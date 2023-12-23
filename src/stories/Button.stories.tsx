import type { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";
import { Button as Component } from "../components/Button";
import { AnimatedReload } from "../icons/Reload";
import { useState } from "react";
import React from "react";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Components/Button",
  component: Component,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    // layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "tertiary", "danger"],
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

const Button = ({ ...args }) => {
  const [buttonHidden, setButtonHidden] = useState<0 | 1 | 2>(0);
  const onClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    args.onClick?.(e);
    setButtonHidden(1);

    const response = await fetch("test");
    await response.json();
    setButtonHidden(2);
  };

  // if (buttonHidden === 2) {
  //   return <span>button unmounted to check is there any leak</span>;
  // }

  return (
    <Component
      isBusy={buttonHidden === 1 || args.isBusy}
      {...args}
      onClick={onClick}
    >
      {args.children}
    </Component>
  );
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Enable: Story = {
  render: Button,
  args: {
    isBusy: false,
    children: "Button",
    whenBusy: <AnimatedReload primaryColor="white" size={14} />,
  },
  parameters: {
    msw: [
      rest.get("/test", (_req, res, ctx) => {
        return res(ctx.delay(3000), ctx.json({ a: "msw response" }));
      }),
    ],
  },
};
export const IconButton: Story = {
  render: Button,
  args: {
    isBusy: false,
    children: <svg width="24" height="24" />,
    whenBusy: "Loading",
  },
  parameters: {
    msw: [
      rest.get("/test", (_req, res, ctx) => {
        return res(ctx.delay(3000), ctx.json({ a: "msw response" }));
      }),
    ],
  },
};
export const Focus: Story = {
  render: Button,
  args: {
    isBusy: false,
    children: "Button AAA",
    whenBusy: "Loading",
    className: "focus",
  },
  parameters: {
    msw: [
      rest.get("/test", (_req, res, ctx) => {
        return res(ctx.delay(3000), ctx.json({ a: "msw response" }));
      }),
    ],
  },
};
export const Hover: Story = {
  render: Button,
  args: {
    isBusy: false,
    children: "Button AAA",
    whenBusy: "Loading",
    className: "hover",
  },
  parameters: {
    msw: [
      rest.get("/test", (_req, res, ctx) => {
        return res(ctx.delay(3000), ctx.json({ a: "msw response" }));
      }),
    ],
  },
};
export const Disabled: Story = {
  render: Button,
  args: {
    isBusy: false,
    children: "Button AAA",
    whenBusy: "Loading",
    disabled: true,
  },
  parameters: {
    msw: [
      rest.get("/test", (_req, res, ctx) => {
        return res(ctx.delay(3000), ctx.json({ a: "msw response" }));
      }),
    ],
  },
};
