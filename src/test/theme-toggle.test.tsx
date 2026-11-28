import { act } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "@/components/product/ThemeToggle";

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  localStorage.removeItem("fasthand-theme");
});

describe("ThemeToggle", () => {
  it("cycles through a large message deck without immediate repeats or palette changes", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: "Dark mode" });
    const htmlBefore = document.documentElement.className;
    const messages: string[] = [];

    for (let click = 0; click < 40; click += 1) {
      fireEvent.click(button);
      const status = screen.getByRole("status");
      expect(button).toHaveAttribute("aria-describedby", status.id);
      messages.push(status.textContent ?? "");
    }

    expect(new Set(messages).size).toBeGreaterThanOrEqual(12);
    expect(messages.slice(1).filter((message, index) => message === messages[index])).toHaveLength(
      0,
    );
    expect(messages.every((message) => !message.includes("—"))).toBe(true);
    expect(document.documentElement.className).toBe(htmlBefore);
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("fasthand-theme")).toBeNull();
  });

  it("restarts the glyph beat and dismisses the answer", () => {
    const { container } = render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "Dark mode" }));

    expect(container.querySelector(".theme-glyph")).toHaveAttribute("data-declining", "true");
    expect(screen.getByRole("status")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(849);
    });
    expect(container.querySelector(".theme-glyph")).toHaveAttribute("data-declining", "true");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(container.querySelector(".theme-glyph")).toHaveAttribute("data-declining", "false");
    expect(screen.getByRole("status")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2349);
    });
    expect(screen.getByRole("status")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
