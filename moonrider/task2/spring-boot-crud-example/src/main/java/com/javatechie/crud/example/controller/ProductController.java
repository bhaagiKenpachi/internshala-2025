package com.javatechie.crud.example.controller;

import com.javatechie.crud.example.entity.Product;
import com.javatechie.crud.example.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class ProductController {

    @Autowired
    private ProductService service;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "Product Catalog Service"));
    }

    @PostMapping("/addProduct")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        try {
            Product savedProduct = service.saveProduct(product);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to add product: " + e.getMessage()));
        }
    }

    @PostMapping("/addProducts")
    public ResponseEntity<?> addProducts(@RequestBody List<Product> products) {
        try {
            List<Product> savedProducts = service.saveProducts(products);
            return ResponseEntity.ok(savedProducts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to add products: " + e.getMessage()));
        }
    }

    @GetMapping("/products")
    public ResponseEntity<?> findAllProducts() {
        try {
            List<Product> products = service.getProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to retrieve products: " + e.getMessage()));
        }
    }

    @GetMapping("/products/search")
    public ResponseEntity<?> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer minQuantity) {
        try {
            List<Product> products = service.searchProducts(keyword, minPrice, maxPrice, minQuantity);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Search failed: " + e.getMessage()));
        }
    }

    @GetMapping("/productById/{id}")
    public ResponseEntity<?> findProductById(@PathVariable int id) {
        try {
            Product product = service.getProductById(id);
            if (product == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to retrieve product: " + e.getMessage()));
        }
    }

    @GetMapping("/product/{name}")
    public ResponseEntity<?> findProductByName(@PathVariable String name) {
        try {
            Product product = service.getProductByName(name);
            if (product == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to retrieve product: " + e.getMessage()));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProduct(@RequestBody Product product) {
        try {
            Product updatedProduct = service.updateProduct(product);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update product: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable int id) {
        try {
            String result = service.deleteProduct(id);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete product: " + e.getMessage()));
        }
    }
}
