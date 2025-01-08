// Function to add items to cart
function addToCart(button) {
    const product = button.closest(".product");
    const productName = product.getAttribute("data-name");
    const productPrice = parseFloat(product.getAttribute("data-price"));

    // Retrieve the current cart from local storage, or initialize an empty array
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }

    // Save the updated cart back to local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update the cart count display
    updateCartCount();

    // Display a confirmation message
    alert(`${productName} has been added to your cart!`);
}

// Function to update the cart count display in the navigation
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").textContent = cartCount;
}

// Initialize the cart count on page load
document.addEventListener("DOMContentLoaded", updateCartCount);
// Function to display cart items on the cart page
function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cart-items");
    const totalAmountElem = document.getElementById("total-amount");
    cartItemsContainer.innerHTML = ""; // Clear existing items

    let totalAmount = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalAmountElem.textContent = totalAmount.toFixed(2);
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <h4>${item.name}</h4>
            <p>Price: $${item.price.toFixed(2)}</p>
            <p>Quantity: 
                <button onclick="updateQuantity(${index}, -1)">-</button>
                ${item.quantity}
                <button onclick="updateQuantity(${index}, 1)">+</button>
            </p>
            <p>Total: $${itemTotal.toFixed(2)}</p>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    totalAmountElem.textContent = totalAmount.toFixed(2);
}

// Function to update quantity of an item
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart[index]) {
        cart[index].quantity += change;

        // Remove item if quantity goes to zero
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        // Save updated cart to localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Update cart display
        displayCartItems();
        updateCartCount();
    }
}

// Function to clear the cart
function clearCart() {
    localStorage.removeItem("cart");
    displayCartItems();
    updateCartCount();
}

// Initialize the cart display on page load if on cart page
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("cart-items")) {
        displayCartItems();
    }
})
// Function to place an order
function placeOrder() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Your cart is empty. Please add items to your cart before ordering.");
        return;
    }

    // Generate an order summary
    let orderSummary = "Order Summary:\n";
    let totalAmount = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        orderSummary += `${item.name} - Quantity: ${item.quantity} - Total: $${itemTotal.toFixed(2)}\n`;
    });

    orderSummary += `\nTotal Amount: $${totalAmount.toFixed(2)}`;

    // Display the order summary and clear the cart if confirmed
    const confirmOrder = confirm(`${orderSummary}\n\nDo you want to place the order?`);
    if (confirmOrder) {
        alert("Thank you for your order!");
        clearCart(); // Clear the cart after order is placed
    }
    
}
// Function to simulate placing an order and saving it in localStorage
function placeOrder() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Your cart is empty. Please add items to your cart before ordering.");
        return;
    }

    // Generate an order summary
    let orderSummary = "Order Summary:\n";
    let totalAmount = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        orderSummary += `${item.name} - Quantity: ${item.quantity} - Total: $${itemTotal.toFixed(2)}\n`;
    });

    orderSummary += `\nTotal Amount: $${totalAmount.toFixed(2)}`;

    // Display the order summary and save the order if confirmed
    const confirmOrder = confirm(`${orderSummary}\n\nDo you want to place the order?`);
    if (confirmOrder) {
        alert("Thank you for your order!");

        // Retrieve existing orders or initialize empty array
        let orders = JSON.parse(localStorage.getItem("orders")) || [];

        // Create a new order object
        const newOrder = {
            id: `ORD-${Date.now()}`, // Unique ID for each order
            items: cart,
            total: totalAmount.toFixed(2),
            date: new Date().toLocaleString()
        };

        // Save the new order
        orders.push(newOrder);
        localStorage.setItem("orders", JSON.stringify(orders));

        // Clear the cart
        clearCart();
    }
}

// Function to display orders on the admin page
function displayOrders() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const orderListContainer = document.getElementById("order-list");
    orderListContainer.innerHTML = ""; // Clear existing content

    if (orders.length === 0) {
        orderListContainer.innerHTML = "<p>No orders have been placed yet.</p>";
        return;
    }

    orders.forEach((order, index) => {
        const orderDiv = document.createElement("div");
        orderDiv.classList.add("order");

        const orderDetails = `
            <h3>Order ID: ${order.id}</h3>
            <p>Date: ${order.date}</p>
            <p>Total Amount: $${order.total}</p>
            <h4>Items:</h4>
            <ul>
                ${order.items.map(item => `<li>${item.name} - Quantity: ${item.quantity}</li>`).join("")}
            </ul>
            <button onclick="deleteOrder(${index})">Delete Order</button>
        `;

        orderDiv.innerHTML = orderDetails;
        orderListContainer.appendChild(orderDiv);
    });
}

// Function to delete an individual order
function deleteOrder(index) {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.splice(index, 1); // Remove the selected order
    localStorage.setItem("orders", JSON.stringify(orders)); // Save updated orders
    displayOrders(); // Refresh the order list
}

// Function to clear all orders
function clearAllOrders() {
    const confirmClear = confirm("Are you sure you want to delete all orders?");
    if (confirmClear) {
        localStorage.removeItem("orders"); // Clear all orders from localStorage
        displayOrders(); // Refresh the order list
    }
}

// Initialize orders display on admin page load
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("order-list")) {
        displayOrders();
    }
})
// Carousel functionality
let currentSlide = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carousel-item');
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 3000); // Change slide every 3 seconds
});





