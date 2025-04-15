// Stripe configuration
const stripe = Stripe('YOUR_STRIPE_PUBLIC_KEY');

// DOM Elements
const subscriptionStatus = document.getElementById('subscriptionStatus');
const subscribeBtn = document.getElementById('subscribeBtn');

let currentUser = null;

// Authentication State Observer
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = '/';
        return;
    }
    
    currentUser = user;
    checkSubscriptionStatus(user.uid);
});

// Check subscription status
function checkSubscriptionStatus(userId) {
    database.ref(`users/${userId}/subscription`).on('value', (snapshot) => {
        const subscription = snapshot.val();
        
        if (subscription && subscription.status === 'active') {
            subscriptionStatus.innerHTML = `
                <div class="alert alert-success">
                    <i class="bi bi-check-circle-fill me-2"></i>
                    You are currently a premium member!
                </div>
            `;
            subscribeBtn.textContent = 'Manage Subscription';
            subscribeBtn.onclick = manageSubscription;
        } else {
            subscriptionStatus.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle-fill me-2"></i>
                    Subscribe to enjoy ad-free viewing and other premium features
                </div>
            `;
            subscribeBtn.textContent = 'Subscribe Now';
            subscribeBtn.onclick = createSubscription;
        }
    });
}

// Create subscription
async function createSubscription() {
    try {
        // Create a checkout session
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUser.uid,
                priceId: 'YOUR_STRIPE_PRICE_ID' // Monthly $4.99 plan
            })
        });
        
        const session = await response.json();
        
        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        });
        
        if (result.error) {
            alert(result.error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

// Manage subscription
async function manageSubscription() {
    try {
        // Create a billing portal session
        const response = await fetch('/create-portal-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUser.uid
            })
        });
        
        const session = await response.json();
        
        // Redirect to Stripe Customer Portal
        window.location.href = session.url;
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

// Handle Stripe webhook events
async function handleStripeWebhook(event) {
    const sig = event.headers['stripe-signature'];
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(
            event.body,
            sig,
            'YOUR_STRIPE_WEBHOOK_SECRET'
        );
    } catch (err) {
        console.error('Webhook Error:', err.message);
        return { statusCode: 400 };
    }
    
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            await handleSubscriptionCreated(session);
            break;
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
            const subscription = event.data.object;
            await handleSubscriptionUpdated(subscription);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    
    return { statusCode: 200 };
}

// Handle subscription created
async function handleSubscriptionCreated(session) {
    const userId = session.client_reference_id;
    
    await database.ref(`users/${userId}/subscription`).set({
        status: 'active',
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        currentPeriodEnd: new Date(session.subscription.current_period_end * 1000).toISOString()
    });
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription) {
    const userId = await getUserIdFromStripeCustomer(subscription.customer);
    
    if (subscription.status === 'active') {
        await database.ref(`users/${userId}/subscription`).update({
            status: 'active',
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
        });
    } else {
        await database.ref(`users/${userId}/subscription`).update({
            status: 'canceled'
        });
    }
}

// Get user ID from Stripe customer ID
async function getUserIdFromStripeCustomer(customerId) {
    const snapshot = await database.ref('users')
        .orderByChild('subscription/stripeCustomerId')
        .equalTo(customerId)
        .once('value');
    
    const userData = snapshot.val();
    return Object.keys(userData)[0];
} 