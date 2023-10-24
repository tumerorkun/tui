import type { Meta, StoryObj } from "@storybook/react";

const Color = ({ color }: { color?: string }) => (
  <div style={{ backgroundColor: color }} />
);

const meta = {
  title: "Configs/Colors",
  component: Color,
  tags: ["hide"],
  argTypes: { color: { control: "color" } },
} satisfies Meta<typeof Color>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  args: {},
};
