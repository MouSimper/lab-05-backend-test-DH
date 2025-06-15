const Inventory = require("./inventory");

describe("Inventory System", () => {
  let inventory;

  beforeEach(() => {
    inventory = new Inventory();
    const mockDate = new Date("2023-01-01T00:00:00.000Z");
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
  });

  describe("Add Product", () => {
    test("should add a new product successfully", () => {
      const product = {
        id: 1,
        name: "Producto 1",
        price: 100,
        stock: 10,
        category: "Electrónica",
      };

      const response = inventory.addProduct(product);

      expect(response).toEqual({
        ...product,
        createdAt: new Date("2023-01-01T00:00:00.000Z"),
      });

      expect(inventory.products).toEqual([
        {
          ...product,
          createdAt: new Date("2023-01-01T00:00:00.000Z"),
        },
      ]);

      expect(response.createdAt).toEqual(new Date("2023-01-01T00:00:00.000Z"));
    });

    test("should throw error if payload does not have required fields", () => {
      const payload = {
        id: 5,
        price: 100,
        category: "Electrónica",
      };

      expect(() => inventory.addProduct(payload)).toThrow(
        "El producto debe tener id, nombre, precio y categoría"
      );
    });

    test("should throw error if product already exists", () => {
      const payload = {
        id: 1,
        name: "Producto 1",
        price: 100,
        category: "Electrónica",
      };

      const alreadyExistingProduct = {
        id: 1,
        name: "Producto 2",
        price: 300,
        category: "Hogar",
      };

      inventory.addProduct(alreadyExistingProduct);

      expect(() => inventory.addProduct(payload)).toThrow(
        "Ya existe un producto con este ID"
      );
    });

    test("should throw error if price is less than 0", () => {
      const payload = {
        id: 1,
        name: "Producto 1",
        price: 0,
        category: "Electrónica",
      };

      expect(() => inventory.addProduct(payload)).toThrow(
        "El precio debe ser mayor que cero"
      );
    });
  });

  describe("Update Stock", () => {
    test("should update stock successfully", () => {
      const product = {
        id: 1,
        name: "Producto 1",
        price: 100,
        stock: 5,
        category: "Electrónica",
      };

      inventory.addProduct(product);
      const updatedProduct = inventory.updateStock(1, 3); // suma stock

      expect(updatedProduct.stock).toBe(8);
      expect(updatedProduct.updatedAt).toEqual(new Date("2023-01-01T00:00:00.000Z"));
    });

    test("should not allow negative stock", () => {
      const product = {
        id: 1,
        name: "Producto 1",
        price: 100,
        stock: 2,
        category: "Electrónica",
      };

      inventory.addProduct(product);

      expect(() => inventory.updateStock(1, -3)).toThrow(
        "El stock no puede ser negativo"
      );
    });
  });

  describe("Get Products by Category", () => {
    test("should return products in category", () => {
      inventory.addProduct({ id: 1, name: "TV", price: 500, stock: 5, category: "Electrónica" });
      inventory.addProduct({ id: 2, name: "Plancha", price: 100, stock: 10, category: "Hogar" });
      inventory.addProduct({ id: 3, name: "Laptop", price: 800, stock: 2, category: "Electrónica" });

      const electronics = inventory.getProductsByCategory("Electrónica");

      expect(electronics.length).toBe(2);
      expect(electronics.every(p => p.category === "Electrónica")).toBe(true);
    });

    test("should throw error for non-existent category", () => {
      inventory.addProduct({ id: 1, name: "TV", price: 500, stock: 5, category: "Electrónica" });

      expect(() => inventory.getProductsByCategory("Juguetes")).toThrow(
        "No existen productos en la categoría solicitada"
      );
    });
  });

  describe("Calculate Total Value", () => {
    test("should calculate total inventory value", () => {
      inventory.addProduct({ id: 1, name: "TV", price: 500, stock: 2, category: "Electrónica" });
      inventory.addProduct({ id: 2, name: "Mouse", price: 50, stock: 4, category: "Electrónica" });

      const totalValue = inventory.calculateTotalValue();

      expect(totalValue).toBe(500 * 2 + 50 * 4); // 1000 + 200 = 1200
    });

    test("should return zero for empty inventory", () => {
      const totalValue = inventory.calculateTotalValue();
      expect(totalValue).toBe(0);
    });
  });
});
