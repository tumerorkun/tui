import type { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";
import { Button } from ".";
import { useState } from "react";
import React from "react";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    // layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = ({ ...args }) => {
  const [buttonHidden, setButtonHidden] = useState<0 | 1 | 2>(0);
  const onClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    args.onClick?.(e);
    setButtonHidden(1);

    const response = await fetch("test");
    const data = await response.json();
    setButtonHidden(2);
    console.log("data", data);
  };
  if (buttonHidden === 2) {
    return <span>button unmounted to check is there any leak</span>;
  }

  return (
    <Button
      isLoading={buttonHidden === 1 || args.isLoading}
      onClick={onClick}
      loadingText={args.loadingText}
    >
      {args.children}
    </Button>
  );
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  render: ({ ...args }) => <Template {...args} />,
  args: {
    isLoading: true,
    children: "Button AAA",
    loadingText: "Loading",
  },
  parameters: {
    msw: [
      rest.get("/test", (_req, res, ctx) => {
        return res(ctx.delay(3000), ctx.json({ a: "msw response" }));
      }),
    ],
  },
};
