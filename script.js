// Cart and Purchase History State
let cart = [];
let purchaseHistory = [];

// DOM Elements
const cartModal = document.getElementById('cartModal');
const historyModal = document.getElementById('historyModal');
const cartBtn = document.getElementById('cartBtn');
const historyBtn = document.getElementById('historyBtn');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const purchaseHistoryDiv = document.getElementById('purchaseHistory');

// Close buttons
document.querySelectorAll('.close').forEach(button => {
    button.onclick = function() {
        cartModal.style.display = 'none';
        historyModal.style.display = 'none';
    }
});

// Cart Button Click
cartBtn.onclick = function() {
    cartModal.style.display = 'block';
    updateCartDisplay();
}

// History Button Click
historyBtn.onclick = function() {
    historyModal.style.display = 'block';
    updatePurchaseHistory();
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target == cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target == historyModal) {
        historyModal.style.display = 'none';
    }
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
// Remove from Cart
function removeFromCart(itemName) {
    const confirmDelete = confirm("Are you sure you want to remove this item from your cart?");
    if (confirmDelete) {
        // Find the item in the cart using its name and quantity
        const index = cart.findIndex(item => item.name === itemName);

        if (index !== -1) {
            cart.splice(index, 1); // Remove the item from the cart
            updateCartDisplay();
            updateCartCount();
        }
    }
}


// Checkout Function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

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
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)  // Fix total calculation
    };

    purchaseHistory.push(purchase);
    savePurchaseHistory();

    cart = [];  // Clear cart after purchase
    updateCartDisplay();
    updateCartCount();

    alert('Thank you for your purchase!');
    cartModal.style.display = 'none';
}


// Update Purchase History Display
function updatePurchaseHistory() {
    purchaseHistoryDiv.innerHTML = '';  // Clear the history content

    purchaseHistory.forEach((purchase, index) => {
        const purchaseElement = document.createElement('div');
        purchaseElement.className = 'purchase-item';

        // Group items by name to avoid repetition
        const groupedItems = purchase.items.reduce((acc, item) => {
            if (acc[item.name]) {
                acc[item.name].quantity += item.quantity;  // Sum quantities for duplicate items
            } else {
                acc[item.name] = { ...item };  // Clone the item to avoid modifying the original
            }
            return acc;
        }, {});

        // Generate HTML for grouped items
        let itemsHtml = Object.values(groupedItems).map(item => {
            const price = item.price || 0;  // Default to 0 if price is null/undefined
            const quantity = item.quantity || 0;  // Default to 0 if quantity is null/undefined
            const total = (price * quantity).toFixed(2);  // Calculate total safely

            // Display the item name, total, and quantity (x1, x2, etc.)
            return `
                <div class="purchase-item-details">
                    <img src="${item.imageUrl}" alt="${item.name}" class="purchase-item-image"> <!-- Display item image -->
                    <p>${item.name} x${quantity} - ₱${total}</p> <!-- Show quantity (x1, x2, etc.) and total -->
                </div>
            `;
        }).join('');  // Join the item HTML elements to form a list

        // Safely handle `purchase.total`
        const total = purchase.total ? purchase.total.toFixed(2) : '0.00';

        // Set inner HTML for the purchase element
        purchaseElement.innerHTML = `
            <h4>Purchase on ${purchase.date}</h4>
            ${itemsHtml}  <!-- Display item details including quantity and image -->
            <p><strong>Total: ₱${total}</strong></p>
            <button onclick="deletePurchaseHistory(${index})" class="delete-btn">Delete</button>
        `;

        purchaseHistoryDiv.appendChild(purchaseElement);  // Append the purchase item to the history div
    });
}


// Delete Purchase History Item
// Delete Purchase History Item with confirmation
function deletePurchaseHistory(index) {
    const confirmDelete = confirm("Are you sure you want to delete this purchase?");
    if (confirmDelete) {
        purchaseHistory.splice(index, 1);
        savePurchaseHistory();
        updatePurchaseHistory();
    }
}





// Save Purchase History to Local Storage
function savePurchaseHistory() {
    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
}

// Load Purchase History from Local Storage
function loadPurchaseHistory() {
    const saved = localStorage.getItem('purchaseHistory');
    if (saved) {
        purchaseHistory = JSON.parse(saved);
    }
}

// Initialize
loadPurchaseHistory();
