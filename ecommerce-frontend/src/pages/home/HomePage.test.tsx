import { it, expect, describe, vi } from "vitest";
import axios from "axios";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "./HomePage";
import { ThemeProvider } from "../../context/ThemeProvider"; // 路徑依你的專案調整

vi.mock("axios");

describe("HomePage Component", () => {
  let loadCart: () => Promise<void>;

  beforeEach(() => {
    loadCart = vi.fn();

    // axios.get.mockImplementation()
    vi.spyOn(axios, "get").mockImplementation(async (urlPath) => {
      if (urlPath === "/api/products") {
        return {
          data: [
            {
              id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
              image: "images/products/athletic-cotton-socks-6-pairs.jpg",
              name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
              rating: {
                stars: 4.5,
                count: 87,
              },
              priceCents: 1090,
              keywords: ["socks", "sports", "apparel"],
            },
            {
              id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
              image: "images/products/intermediate-composite-basketball.jpg",
              name: "Intermediate Size Basketball",
              rating: {
                stars: 4,
                count: 127,
              },
              priceCents: 2095,
              keywords: ["sports", "basketballs"],
            },
          ],
        };
      }
    });
  });

  it("renders correct products", async () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <HomePage cart={[]} loadCart={loadCart} />
        </ThemeProvider>
      </MemoryRouter>
    );

    const productContainers = await screen.findAllByTestId("product-container");
    expect(productContainers).toHaveLength(2);

    expect(
      within(productContainers[0]).getByText(
        "Black and Gray Athletic Cotton Socks - 6 Pairs"
      )
    ).toBeInTheDocument();

    expect(
      within(productContainers[1]).getByText("Intermediate Size Basketball")
    ).toBeInTheDocument();
  });
});
