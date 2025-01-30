// Purchase History State
let purchaseHistory = [];

// DOM Elements
const historyModal = document.getElementById('historyModal');
const historyBtn = document.getElementById('historyBtn');
const purchaseHistoryDiv = document.getElementById('purchaseHistory');

// History Button Click
historyBtn.onclick = function() {
    historyModal.style.display = 'block';
    updatePurchaseHistory();
}

// Add to Purchase History
function addToPurchaseHistory(purchase) {
    purchaseHistory.push(purchase);
    savePurchaseHistory();
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