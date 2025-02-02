// Cart State
let cart = [];

// DOM Elements
const cartModal = document.getElementById('cartModal');
const cartBtn = document.getElementById('cartBtn');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');

// Cart Button Click
cartBtn.onclick = function() {
    cartModal.style.display = 'block';
    updateCartDisplay();
}

// Add to Cart Function
function addToCart(name, price, button, imageUrl) {
    const quantityInput = button.parentElement.querySelector('.quantity-input');
    const quantity = parseInt(quantityInput.value);

    if (isNaN(quantity) || quantity < 1) { // Check if the quantity is not a number or less than 1
        alert('Please enter a valid quantity');
        return;
    }

    // Add the item to the cart with quantity and image
    cart.push({
        name,
        price,
        quantity,  // Store the quantity
        imageUrl   // Store the image URL for the item
    });

    updateCartCount();
    showAddedToCartMessage(name, quantity);
}




// Update Cart Count
function updateCartCount() {
    const totalItems = cart.length;
    cartCount.textContent = totalItems;
}

// Show Added to Cart Message
function showAddedToCartMessage(name, quantity) {
    const message = document.createElement('div');
    message.className = 'added-to-cart-message';
    message.textContent = `Added ${quantity} ${name} to cart`;
    message.style.position = 'fixed';
    message.style.bottom = '20px';
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.backgroundColor = '#4CAF50';
    message.style.color = 'white';
    message.style.padding = '10px 20px';
    message.style.borderRadius = '5px';
    message.style.zIndex = '1000';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Update Cart Display
function updateCartDisplay() {
    cartItems.innerHTML = '';  // Clear the cart content
    let total = 0;  // Initialize total for all items

    // Group items by name to avoid repetition
    const groupedItems = cart.reduce((acc, item) => {
        if (acc[item.name]) {
            acc[item.name].quantity += item.quantity;  // Sum quantities for duplicate items
        } else {
            acc[item.name] = { ...item };  // Clone the item to avoid modifying the original
        }
        return acc;
    }, {});

    // Loop through the grouped items to display them
    for (const itemName in groupedItems) {
        const item = groupedItems[itemName];
        const itemTotal = item.price * item.quantity;  // Calculate total price for this item
        total += itemTotal;  // Add this item’s total to the overall total

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';

        itemElement.innerHTML = `
            <div class="cart-item-details">
             <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image">  <!-- Display item image -->
                <p>${itemName} x${item.quantity} </p> <!-- Show item name and quantity -->
            </div>
            <div class="cart-item-price">
                <p>₱${itemTotal.toFixed(2)}</p> <!-- Show total price for this item -->
                <button onclick="removeFromCart('${itemName}')" class="delete-btn">Delete</button> <!-- Delete button -->
            </div>
        `;

        cartItems.appendChild(itemElement);  // Append the item to the cart
    }

    // Update the total price of all items in the cart
    cartTotal.textContent = `${total.toFixed(2)}`;
}







// Remove from Cart
function removeFromCart(index) {
    const confirmDelete = confirm("Are you sure you want to remove this item from your cart?");
    if (confirmDelete) {
        cart.splice(index, 1);
        updateCartDisplay();
        updateCartCount();
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Confirmation alert
    const confirmCheckout = confirm('Do you want to proceed with the checkout?');
    
    if (!confirmCheckout) {
        return; // Stop the checkout if the user clicks "Cancel"
    }

    // Date and time for purchase
    const purchase = {
        items: [...cart],
        date: new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date()) + 
            ', ' + 
            new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            }).format(new Date()),
        total: cart.reduce((sum, item) => sum + item.price, 0)
    };

    addToPurchaseHistory(purchase);
    
    cart = [];
    updateCartDisplay();
    updateCartCount();
    
    alert('Thank you for your purchase!');
    cartModal.style.display = 'none';
}