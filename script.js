// Website data and state
const appState = {
    currentPage: 'home',
    cart: [],
    products: [
        {
            id: 1,
            name: ' Cow Milk',
            category: 'milk',
            price: 50,
             image: "./product images/lassi.jpg",
            unit: 'per liter'
        },
        {
            id: 2,
            name: 'Buffalo Milk',
            category: 'milk',
            price: 75,
            image: "./product images/lassi.jpg",
        },
        {
            id: 3,
            name: 'Toned Milk',
            category: 'milk',
            price: 50,
            image: "./product images/lassi.jpg",
            unit: 'per liter'
        },
        {
            id: 4,
            name: 'Fresh Curd',
            category: 'by-products',
            price: 120,
            image: "./product images/dahi.jpg",

            unit: 'per 1 kg'
        },
        {
            id: 5,
            name: 'Pure Ghee',
            category: 'by-products',
            price: 500,
            image: "./product images/ghee.jpg",
             unit: 'per 650kg'
        },
        {
            id: 6,
            name: 'Fresh Paneer',
            category: 'by-products',
            price: 320,
            image: "./product images/panner.jpg",
            unit: 'per 1kg'
        },
        {
            id: 7,
            name: 'lassi',
            category: 'by-products',
            price: 40,
            image: "./product images/lassi.jpg",
            unit: 'per 500g'
        },
        {
            id: 8,
            name: 'Fresh Tomatoes',
            category: 'vegetables',
            price: 40,
             image: "./product images/tomato.jpg",
            unit: 'per kg'
        },
        {
            id: 9,
            name: 'Organic Potatoes',
            category: 'vegetables',
            price: 30,
            image: "./product images/lassi.jpg",
            unit: 'per kg'
        },
        {
            id: 10,
            name: 'Fresh Onions',
            category: 'vegetables',
            price: 35,
             image: "./product images/lassi.jpg",
            unit: 'per kg'
        },
        {
            id: 11,
            name: 'Green Spinach',
            category: 'vegetables',
            price: 25,
            image: "./product images/lassi.jpg",
            unit: 'per bunch'
        },
        {
            id: 12,
            name: 'Fresh Apples',
            category: 'fruits',
            price: 120,
            image: "./product images/apple.jpg",
            unit: 'per kg'
        },
        {
            id: 13,
            name: 'Sweet Bananas',
            category: 'fruits',
            price: 50,
            image: "./product images/banana.jpg",
            unit: 'per dozen'
        },
        {
            id: 14,
            name: 'Seasonal Oranges',
            category: 'fruits',
            price: 80,
            image: "./product images/lassi.jpg",
            unit: 'per kg'
        },
        {
            id: 15,
            name: 'Fresh Grapes',
            category: 'fruits',
            price: 100,
             image: "./product images/graps.jpg",
            unit: 'per kg'
        }
    ]
};

// DOM elements
const navMenu = document.getElementById('nav-menu');
const mobileMenu = document.getElementById('mobile-menu');
const cartCount = document.querySelector('.cart-count');
const mainContent = document.getElementById('main-content');
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const productsGrid = document.getElementById('products-grid');
const cartItems = document.getElementById('cart-items');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutItems = document.getElementById('checkout-items');
const successModal = document.getElementById('success-modal');
const continueShoppingBtn = document.getElementById('continue-shopping');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeEventListeners();
    loadProducts('all');
    updateCartDisplay();
    
    // Set current page from URL hash
    const hash = window.location.hash.substring(1) || 'home';
    navigateToPage(hash);
});

// Initialize navigation
function initializeNavigation() {
    // Mobile menu toggle
    mobileMenu.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateToPage(page);
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    });
    
    // View products buttons on home page
    document.querySelectorAll('.view-products').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            navigateToPage('products');
            // Highlight the category tab
            setTimeout(() => {
                document.querySelectorAll('.category-tab').forEach(tab => {
                    tab.classList.remove('active');
                    if (tab.getAttribute('data-category') === category) {
                        tab.classList.add('active');
                    }
                });
                loadProducts(category);
            }, 100);
        });
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Category tabs on products page
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            loadProducts(category);
            
            // Update active tab
            document.querySelectorAll('.category-tab').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        if (appState.cart.length > 0) {
            navigateToPage('checkout');
            updateCheckoutDisplay();
        }
    });
    
    // Payment method toggle
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const qrSection = document.getElementById('qr-section');
    const codSection = document.getElementById('cod-section');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'upi') {
                qrSection.style.display = 'block';
                codSection.style.display = 'none';
                updateCheckoutDisplay();
            } else {
                qrSection.style.display = 'none';
                codSection.style.display = 'block';
                updateCheckoutDisplay();
            }
        });
    });
    
    // Checkout form submission
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showOrderSuccess();
    });
    
    // Contact form submission
    document.getElementById('messageForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
    
    // Continue shopping button in success modal
    continueShoppingBtn.addEventListener('click', function() {
        successModal.style.display = 'none';
        navigateToPage('home');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });
}

// Navigate to a page
function navigateToPage(page) {
    // Update active page
    pages.forEach(p => {
        p.classList.remove('active');
        if (p.id === page) {
            p.classList.add('active');
        }
    });
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });
    
    // Update URL hash
    window.location.hash = page;
    
    // Update app state
    appState.currentPage = page;
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Load products based on category
function loadProducts(category) {
    productsGrid.innerHTML = '';
    
    let filteredProducts = appState.products;
    if (category !== 'all') {
        filteredProducts = appState.products.filter(product => product.category === category);
    }
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div class="no-products"><p>No products found in this category.</p></div>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card HTML
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <div class="product-price">₹${product.price} <span>${product.unit}</span></div>
            <div class="quantity-selector">
                <button class="quantity-btn minus" data-id="${product.id}">-</button>
                <input type="number" class="quantity-input" data-id="${product.id}" value="1" min="1">
                <button class="quantity-btn plus" data-id="${product.id}">+</button>
            </div>
            <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
    `;
    
    // Add event listeners to buttons
    card.querySelector('.add-to-cart').addEventListener('click', function() {
        const productId = parseInt(this.getAttribute('data-id'));
        const quantity = parseInt(card.querySelector('.quantity-input').value);
        addToCart(productId, quantity);
    });
    
    card.querySelector('.minus').addEventListener('click', function() {
        const input = card.querySelector('.quantity-input');
        let value = parseInt(input.value);
        if (value > 1) {
            input.value = value - 1;
        }
    });
    
    card.querySelector('.plus').addEventListener('click', function() {
        const input = card.querySelector('.quantity-input');
        let value = parseInt(input.value);
        input.value = value + 1;
    });
    
    card.querySelector('.quantity-input').addEventListener('change', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            this.value = 1;
        }
    });
    
    return card;
}

// Add product to cart
function addToCart(productId, quantity) {
    const product = appState.products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Check if product already in cart
    const existingItemIndex = appState.cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex > -1) {
        // Update quantity
        appState.cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        appState.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image,
            unit: product.unit
        });
    }
    
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`);
}

// Update cart display
function updateCartDisplay() {
    // Update cart count
    const totalItems = appState.cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart page
    if (cartItems) {
        if (appState.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some delicious dairy products to your cart</p>
                    <a href="#products" class="btn btn-primary" data-page="products">Browse Products</a>
                </div>
            `;
            
            // Add event listener to the button
            setTimeout(() => {
                const browseBtn = cartItems.querySelector('.btn-primary');
                if (browseBtn) {
                    browseBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        navigateToPage('products');
                    });
                }
            }, 100);
        } else {
            cartItems.innerHTML = '';
            appState.cart.forEach(item => {
                const cartItem = createCartItem(item);
                cartItems.appendChild(cartItem);
            });
        }
    }
    
    // Update cart totals
    updateCartTotals();
    
    // Enable/disable checkout button
    if (checkoutBtn) {
        checkoutBtn.disabled = appState.cart.length === 0;
    }
}

// Create cart item HTML
function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div class="cart-item-price">₹${item.price} ${item.unit}</div>
            <div class="cart-item-actions">
                <div class="quantity-selector">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" data-id="${item.id}" value="${item.quantity}" min="1">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        </div>
        <div class="cart-item-total">
            <h4>Total</h4>
            <div class="total-price">₹${item.price * item.quantity}</div>
        </div>
    `;
    
    // Add event listeners
    cartItem.querySelector('.minus').addEventListener('click', function() {
        updateCartItemQuantity(item.id, -1);
    });
    
    cartItem.querySelector('.plus').addEventListener('click', function() {
        updateCartItemQuantity(item.id, 1);
    });
    
    cartItem.querySelector('.quantity-input').addEventListener('change', function() {
        const newQuantity = parseInt(this.value);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            setCartItemQuantity(item.id, newQuantity);
        } else {
            this.value = item.quantity;
        }
    });
    
    cartItem.querySelector('.remove-item').addEventListener('click', function() {
        removeFromCart(item.id);
    });
    
    return cartItem;
}

// Update cart item quantity
function updateCartItemQuantity(productId, change) {
    const itemIndex = appState.cart.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
        appState.cart[itemIndex].quantity += change;
        
        if (appState.cart[itemIndex].quantity < 1) {
            appState.cart.splice(itemIndex, 1);
        }
        
        updateCartDisplay();
    }
}

// Set cart item quantity
function setCartItemQuantity(productId, quantity) {
    const itemIndex = appState.cart.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
        appState.cart[itemIndex].quantity = quantity;
        
        if (appState.cart[itemIndex].quantity < 1) {
            appState.cart.splice(itemIndex, 1);
        }
        
        updateCartDisplay();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    const itemIndex = appState.cart.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
        const itemName = appState.cart[itemIndex].name;
        appState.cart.splice(itemIndex, 1);
        updateCartDisplay();
        showNotification(`${itemName} removed from cart`);
    }
}

// Update cart totals
function updateCartTotals() {
    const subtotal = appState.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const delivery = subtotal >= 200 ? 0 : 30;
    const grandTotal = subtotal + delivery;
    
    // Update cart page totals
    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').textContent = `₹${subtotal}`;
        document.getElementById('delivery').textContent = subtotal >= 200 ? 'FREE' : `₹${delivery}`;
        document.getElementById('grand-total').textContent = `₹${grandTotal}`;
    }
    
    // Update checkout page totals if on checkout page
    if (appState.currentPage === 'checkout') {
        updateCheckoutDisplay();
    }
}

// Update checkout display
function updateCheckoutDisplay() {
    if (checkoutItems) {
        checkoutItems.innerHTML = '';
        
        if (appState.cart.length === 0) {
            checkoutItems.innerHTML = '<p>Your cart is empty</p>';
            return;
        }
        
        appState.cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div>
                    <h4>${item.name}</h4>
                    <p>${item.quantity} x ₹${item.price}</p>
                </div>
                <div>₹${item.price * item.quantity}</div>
            `;
            checkoutItems.appendChild(orderItem);
        });
    }
    
    // Update totals
    const subtotal = appState.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const delivery = subtotal >= 200 ? 0 : 30;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const codCharge = paymentMethod === 'cod' ? 20 : 0;
    const grandTotal = subtotal + delivery + codCharge;
    
    if (document.getElementById('checkout-subtotal')) {
        document.getElementById('checkout-subtotal').textContent = `₹${subtotal}`;
        document.getElementById('checkout-delivery').textContent = delivery === 0 ? 'FREE' : `₹${delivery}`;
        document.getElementById('checkout-cod').textContent = codCharge === 0 ? '₹0' : `₹${codCharge}`;
        document.getElementById('checkout-grand-total').textContent = `₹${grandTotal}`;
    }
}

// Show order success modal
function showOrderSuccess() {
    // Generate random order ID
    const orderId = 'FM-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('order-id').textContent = orderId;
    
    // Clear cart
    appState.cart = [];
    updateCartDisplay();
    
    // Show modal
    successModal.style.display = 'flex';
}

// Show notification
function showNotification(message) {
    // Check if notification already exists
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Add notification styles dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-green);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
`;
document.head.appendChild(notificationStyles);

// Handle browser back/forward buttons
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1) || 'home';
    navigateToPage(hash);
});