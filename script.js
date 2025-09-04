// JavaScript for managing booking state and interactivity

// Booking data stored in localStorage key 'bookingItems'
const bookingKey = 'bookingItems';

// Load booking items from localStorage or initialize empty array
function loadBooking() {
  const data = localStorage.getItem(bookingKey);
  return data ? JSON.parse(data) : [];
}

// Save booking items to localStorage
function saveBooking(items) {
  localStorage.setItem(bookingKey, JSON.stringify(items));
}

// Add item to booking
function addToBooking(itemName, price) {
  let items = loadBooking();
  const existing = items.find(i => i.name === itemName);
  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({ name: itemName, price: parseFloat(price), quantity: 1 });
  }
  saveBooking(items);
  alert(itemName + ' added to booking.');
}

// Remove item from booking
function removeFromBooking(itemName) {
  let items = loadBooking();
  items = items.filter(i => i.name !== itemName);
  saveBooking(items);
  renderBooking();
}

// Update quantity of an item
function updateQuantity(itemName, quantity) {
  let items = loadBooking();
  const item = items.find(i => i.name === itemName);
  if (item) {
    item.quantity = quantity > 0 ? quantity : 1;
    saveBooking(items);
    renderBooking();
  }
}

// Render booking page items and summary
function renderBooking() {
  const container = document.getElementById('booking-items');
  const summary = document.getElementById('booking-summary');
  const totalItemsElem = document.getElementById('total-items');
  const totalPriceElem = document.getElementById('total-price');

  let items = loadBooking();

  if (!container || !summary || !totalItemsElem || !totalPriceElem) return;

  if (items.length === 0) {
    container.innerHTML = '<p>No items in your booking.</p>';
    summary.style.display = 'none';
    return;
  }

  container.innerHTML = '';
  let totalItems = 0;
  let totalPrice = 0;

  items.forEach(item => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;

    const div = document.createElement('div');
    div.className = 'booking-item';

    div.innerHTML = `
      <span>${item.name}</span>
      <span>$${item.price.toFixed(2)}</span>
      <input type="number" min="1" value="${item.quantity}" />
      <button class="remove-btn">Remove</button>
    `;

    const input = div.querySelector('input');
    input.addEventListener('change', (e) => {
      const qty = parseInt(e.target.value);
      if (isNaN(qty) || qty < 1) {
        e.target.value = item.quantity;
        return;
      }
      updateQuantity(item.name, qty);
    });

    const removeBtn = div.querySelector('.remove-btn');
    removeBtn.addEventListener('click', () => {
      removeFromBooking(item.name);
    });

    container.appendChild(div);
  });

  totalItemsElem.textContent = totalItems;
  totalPriceElem.textContent = totalPrice.toFixed(2);
  summary.style.display = 'block';
}

// Submit booking handler
function submitBooking() {
  alert('Thank you for your booking! Your order has been submitted.');
  localStorage.removeItem(bookingKey);
  renderBooking();
}

// Add event listeners to add-to-booking buttons on menu page
function setupMenuButtons() {
  const buttons = document.querySelectorAll('.add-to-booking');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const item = button.getAttribute('data-item');
      const price = button.getAttribute('data-price');
      addToBooking(item, price);
    });
  });
}

// Setup submit booking button on booking page
function setupSubmitButton() {
  const submitBtn = document.getElementById('submit-booking');
  if (submitBtn) {
    submitBtn.addEventListener('click', submitBooking);
  }
}

// Initialize page scripts
function init() {
  setupMenuButtons();
  setupSubmitButton();
  renderBooking();
}

// Run init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', init);
