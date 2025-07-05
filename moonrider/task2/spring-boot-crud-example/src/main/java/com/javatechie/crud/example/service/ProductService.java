package com.javatechie.crud.example.service;

import com.javatechie.crud.example.entity.Product;
import com.javatechie.crud.example.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository repository;

    public Product saveProduct(Product product) {
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be null or empty");
        }
        if (product.getPrice() < 0) {
            throw new IllegalArgumentException("Product price cannot be negative");
        }
        if (product.getQuantity() < 0) {
            throw new IllegalArgumentException("Product quantity cannot be negative");
        }
        return repository.save(product);
    }

    public List<Product> saveProducts(List<Product> products) {
        if (products == null || products.isEmpty()) {
            throw new IllegalArgumentException("Products list cannot be null or empty");
        }
        return repository.saveAll(products);
    }

    public List<Product> getProducts() {
        return repository.findAll();
    }

    public List<Product> searchProductsByKeyword(String keyword) {
        List<Product> allProducts = repository.findAll();
        return allProducts.stream()
                .filter(product -> product.getName().toLowerCase().contains(keyword.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Product> searchProducts(String keyword, Double minPrice, Double maxPrice, Integer minQuantity) {
        List<Product> allProducts = repository.findAll();
        
        return allProducts.stream()
                .filter(product -> {
                    // Keyword filter
                    if (keyword != null && !keyword.trim().isEmpty()) {
                        if (!product.getName().toLowerCase().contains(keyword.toLowerCase())) {
                            return false;
                        }
                    }
                    
                    // Price range filter
                    if (minPrice != null && product.getPrice() < minPrice) {
                        return false;
                    }
                    if (maxPrice != null && product.getPrice() > maxPrice) {
                        return false;
                    }
                    
                    // Quantity filter
                    if (minQuantity != null && product.getQuantity() < minQuantity) {
                        return false;
                    }
                    
                    return true;
                })
                .collect(Collectors.toList());
    }

    public Product getProductById(int id) {
        return repository.findById(id).orElse(null);
    }

    public Product getProductByName(String name) {
        return repository.findByName(name);
    }

    public String deleteProduct(int id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Product with id " + id + " does not exist");
        }
        repository.deleteById(id);
        return "Product removed successfully! ID: " + id;
    }

    public Product updateProduct(Product product) {
        if (product.getId() <= 0) {
            throw new IllegalArgumentException("Invalid product ID");
        }
        
        Product existingProduct = repository.findById(product.getId())
                .orElseThrow(() -> new IllegalArgumentException("Product with id " + product.getId() + " does not exist"));
        
        if (product.getName() != null && !product.getName().trim().isEmpty()) {
            existingProduct.setName(product.getName());
        }
        if (product.getQuantity() >= 0) {
            existingProduct.setQuantity(product.getQuantity());
        }
        if (product.getPrice() >= 0) {
            existingProduct.setPrice(product.getPrice());
        }
        
        return repository.save(existingProduct);
    }
}
