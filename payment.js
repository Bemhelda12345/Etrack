// Payment System for ElectriTrack
// Handles bill payment with QR code generation and payment method selection

export function renderPaymentSection() {
    return `
        <div class="payment-container">
            <div class="payment-header">
                <h2>⚡ Bill Payment System</h2>
                <p>Pay your bills easily with PayMaya and GCash</p>
            </div>
            
            <div class="payment-content">
                <div class="payment-form-section">
                    <div class="form-card">
                        <h3>📋 Bill Information</h3>
                        <p class="form-subtitle">Enter your bill details to generate payment QR code</p>
                        
                        <form id="payment-form" class="payment-form">
                            <div class="form-group">
                                <label for="bill-type">Bill Type</label>
                                <select id="bill-type" required>
                                    <option value="">Select bill type</option>
                                    <option value="electric">⚡ Electric Bill</option>
                                    <option value="water">💧 Water Bill</option>
                                    <option value="internet">🌐 Internet Bill</option>
                                    <option value="gas">🔥 Gas Bill</option>
                                    <option value="phone">📱 Phone Bill</option>
                                    <option value="cable">📺 Cable TV</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="account-number">Account Number</label>
                                <input type="text" id="account-number" placeholder="Enter account number" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="customer-name">Customer Name</label>
                                <input type="text" id="customer-name" placeholder="Enter customer name" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="amount">Amount (PHP)</label>
                                <input type="number" id="amount" placeholder="0.00" step="0.01" min="0" required>
                            </div>
                            
                            <button type="submit" class="generate-qr-btn">Generate Payment QR Code</button>
                        </form>
                    </div>
                </div>
                
                <div class="qr-section">
                    <div class="qr-card">
                        <h3>📱 Payment QR Code</h3>
                        <p class="qr-subtitle">Scan the QR code with your selected payment app</p>
                        
                        <div id="qr-display" class="qr-display">
                            <div class="qr-placeholder">
                                <div class="qr-icon">📱</div>
                                <p>QR Code will appear here</p>
                                <span>Fill in bill details and select payment method to generate QR code</span>
                            </div>
                        </div>
                        
                        <div class="payment-methods">
                            <h4>Payment Method</h4>
                            <div class="payment-options">
                                <div class="payment-option" id="gcash-option">
                                    <div class="payment-card gcash-card">
                                        <div class="payment-logo">
                                            <span class="payment-name">GCash</span>
                                        </div>
                                        <p>Scan QR code using your GCash app and enter the amount to pay</p>
                                    </div>
                                </div>
                                
                                <div class="payment-option" id="paymaya-option">
                                    <div class="payment-card paymaya-card">
                                        <div class="payment-logo">
                                            <span class="payment-name">PayMaya</span>
                                        </div>
                                        <p>Scan QR code using your PayMaya app and enter the amount to pay</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="payment-success" class="payment-success hidden">
                <div class="success-card">
                    <div class="success-icon">✅</div>
                    <h3>Payment Details Generated!</h3>
                    <p>Your QR code is ready. Scan with your preferred payment app to complete the transaction.</p>
                </div>
            </div>
        </div>
    `;
}

export function initializePaymentSystem() {
    const form = document.getElementById('payment-form');
    const qrDisplay = document.getElementById('qr-display');
    const paymentOptions = document.querySelectorAll('.payment-option');
    let selectedPaymentMethod = 'gcash'; // default
    let currentBillData = null;

    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        generateQRCode();
    });

    // Payment method selection
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to selected option
            option.classList.add('active');
            
            // Update selected payment method
            selectedPaymentMethod = option.id.replace('-option', '');
            
            // Regenerate QR code if we have bill data
            if (currentBillData) {
                generateQRCode();
            }
        });
    });

    // Set default selection
    document.getElementById('gcash-option').classList.add('active');

    function generateQRCode() {
        const billType = document.getElementById('bill-type').value;
        const accountNumber = document.getElementById('account-number').value;
        const customerName = document.getElementById('customer-name').value;
        const amount = document.getElementById('amount').value;

        if (!billType || !accountNumber || !customerName || !amount) {
            alert('Please fill in all required fields');
            return;
        }

        currentBillData = {
            billType,
            accountNumber,
            customerName,
            amount: parseFloat(amount),
            paymentMethod: selectedPaymentMethod
        };

        // Generate QR code data
        const qrData = generateQRData(currentBillData);
        
        // Display QR code
        displayQRCode(qrData, currentBillData);
        
        // Show success message
        showPaymentSuccess();
    }

    function generateQRData(billData) {
        // Create a payment data string that would be used in real QR code generation
        const paymentData = {
            type: 'payment',
            method: billData.paymentMethod,
            billType: billData.billType,
            accountNumber: billData.accountNumber,
            customerName: billData.customerName,
            amount: billData.amount,
            currency: 'PHP',
            timestamp: Date.now()
        };
        
        return JSON.stringify(paymentData);
    }

    function displayQRCode(qrData, billData) {
        const paymentMethodName = billData.paymentMethod === 'gcash' ? 'GCash' : 'PayMaya';
        const billTypeDisplay = billData.billType.charAt(0).toUpperCase() + billData.billType.slice(1);
        
        qrDisplay.innerHTML = `
            <div class="qr-code-container">
                <div class="qr-code-visual">
                    <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e896c825-4900-4009-8b6d-af61c09d9bae.png}+Payment" 
                         alt="QR Code for ${paymentMethodName} payment" 
                         class="qr-code-image">
                </div>
                <div class="qr-details">
                    <h4>Payment Details</h4>
                    <div class="detail-row">
                        <span>Bill Type:</span>
                        <strong>${billTypeDisplay}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Account:</span>
                        <strong>${billData.accountNumber}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Customer:</span>
                        <strong>${billData.customerName}</strong>
                    </div>
                    <div class="detail-row amount">
                        <span>Amount:</span>
                        <strong>₱${billData.amount.toFixed(2)}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Payment Method:</span>
                        <strong>${paymentMethodName}</strong>
                    </div>
                </div>
            </div>
        `;
    }

    function showPaymentSuccess() {
        const successElement = document.getElementById('payment-success');
        successElement.classList.remove('hidden');
        
        // Hide after 3 seconds
        setTimeout(() => {
            successElement.classList.add('hidden');
        }, 3000);
    }

    // Real-time amount formatting
    const amountInput = document.getElementById('amount');
    amountInput.addEventListener('input', (e) => {
        let value = e.target.value;
        if (value && !isNaN(value)) {
            // Format to 2 decimal places when user stops typing
            setTimeout(() => {
                if (document.activeElement !== e.target) {
                    e.target.value = parseFloat(value).toFixed(2);
                }
            }, 1000);
        }
    });
}

// Utility function to format currency
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(amount);
}