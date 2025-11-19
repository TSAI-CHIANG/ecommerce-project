import { it, expect, describe, vi } from "vitest";
import axios from "axios";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "./HomePage";
import { ThemeProvider } from "../../context/ThemeProvider"; // 路徑依你的專案調整
import type { ProductType } from "../../types";

vi.mock("axios");

describe("HomePage Component", () => {
  let loadCart: () => Promise<void>;
  let mockProducts: ProductType[];

  beforeEach(() => {
    vi.resetAllMocks();

    loadCart = vi.fn();

    mockProducts = [
      {
        id: "1",
        name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
        image: "images/products/athletic-cotton-socks-6-pairs.jpg",
        rating: { stars: 4.5, count: 87 },
        priceCents: 1090,
        keywords: ["socks", "sports"],
      },
      {
        id: "2",
        name: "Intermediate Size Basketball",
        image: "images/products/intermediate-composite-basketball.jpg",
        rating: { stars: 4, count: 127 },
        priceCents: 2095,
        keywords: ["sports"],
      },
    ];

    // axios.get.mockImplementation()
    vi.spyOn(axios, "get").mockImplementation(async (urlPath) => {
      if (urlPath === "/api/products") {
        return {
          data: mockProducts,
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

    expect(axios.get).toHaveBeenCalledTimes(1);

    expect(axios.get).toHaveBeenCalledWith("/api/products");
  });
});
