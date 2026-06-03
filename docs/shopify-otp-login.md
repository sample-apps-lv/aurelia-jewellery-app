# Shopify OTP Login Integration Guide

This document outlines the conceptual workflow for integrating a mobile-first, passwordless OTP (One-Time Password) login system into the Gajanand Jewellers storefront.

## 1. Does Shopify Provide Built-in Mobile OTP?

**No.** Shopify does not currently provide a native, built-in feature for mobile number login with SMS OTP for headless storefronts. 

Shopify's native passwordless authentication ("New Customer Accounts") is limited to **Email OTP** only. To implement **Mobile SMS OTP**, you must use a custom integration or a third-party service to bridge the gap between a mobile number and a Shopify Customer account.

## 2. The Conceptual 4-Step Flow

To achieve mobile login, the application acts as an intermediary between the user, an SMS provider, and Shopify.

1.  **Identity Request**: The user provides their mobile number through the application interface.
2.  **Verification Dispatch**: The application requests an external SMS service (like Twilio or a dedicated Shopify App) to send a unique 6-digit code to the user's mobile device.
3.  **Authentication Challenge**: The user enters the received code. The application validates this code with the SMS service to confirm the user truly owns that mobile number.
4.  **Shopify Session Establishment**: Once the mobile number is verified, the application identifies the corresponding Customer in Shopify and creates a secure login session (using a "Bridge" strategy).

## 3. The "Bridge" Strategy

Since the Shopify Storefront API expects traditional credentials (Email/Password), a "Bridge" is required after the mobile number is verified:

### For Shopify Plus Merchants
The system uses **Shopify Multipass**. Once the phone number is verified, the server generates a secure, one-time-use token that Shopify accepts to immediately log the user in and return a valid access token.

### For Standard Shopify Merchants
The system uses a **Proxy Authentication** approach. The server manages a hidden, secure link between the verified phone number and the Shopify customer profile. When the phone is verified, the server uses administrative privileges to fetch or initialize the customer's session for the storefront.

## 4. Recommended Third-Party Providers

To send SMS codes, you need a provider with a reliable API. There are two main categories of providers:

### A. Developer-First APIs (Build Your Own)
These providers give you full control but require custom backend logic to bridge with Shopify.
*   **Twilio (Verify API)**: The gold standard for global reliability. Their "Verify" service handles code generation and validation automatically on their servers.
*   **Vonage (Verify API)**: A strong competitor to Twilio with excellent delivery rates in Europe and Asia, and automatic "Voice fallback" if SMS fails.
*   **Msg91**: Highly cost-effective, especially for the India/APAC region. Offers a dedicated OTP platform with WhatsApp fallback options.

### B. Shopify-Integrated Apps (Middleware)
These providers offer specialized apps that are already "Shopify-aware," reducing the amount of custom code you need to write.
*   **miniOrange**: Offers a dedicated "Headless OTP" solution. Their app on the Shopify store provides ready-to-use APIs that handle both the SMS delivery and the Shopify Customer lookup.
*   **Otpless**: A modern, specialized provider focused on passwordless authentication that integrates well with headless storefronts.

## 5. Key Components Required

*   **SMS Provider**: A service to handle the physical delivery and verification of SMS codes globally.
*   **Customer Database Mapping**: A way to ensure each mobile number is correctly linked to a unique Shopify Customer ID.
*   **Security Layer**: Measures to prevent "SMS Toll Fraud" (where bots request thousands of codes) and to ensure the login session is protected against unauthorized access.

## 6. Managing Customers in Shopify Admin

Even though the login happens through a custom OTP flow, the customers are still managed directly within your **Shopify Admin Panel**.

### Standard Customer Profiles
Customers created or logged in via mobile OTP appear in the standard **Customers** list. If they do not provide an email, the "Email" field will be blank, but the "Phone" field will be fully populated and verified.

### Searching and Filtering
Your staff can manage these customers just like any others:
*   **Search**: You can search for customers directly by their mobile number in the Admin search bar.
*   **Order History**: All orders placed by the user will be linked to their mobile number profile.
*   **Tags and Metafields**: You can still add tags (e.g., "OTP-Verified", "VIP") or custom metafields to these profiles via the Admin UI.

### Marketing Consent
Shopify tracks **SMS Marketing Consent** separately. During the OTP flow, the application can record the user's consent, which then appears in the Admin panel, allowing you to include them in SMS marketing campaigns or automations.

### Profile Merging
If a customer who previously used mobile OTP later checks out using an email address, Shopify provides a "Merge" feature in the Admin panel. This allows you to combine the phone-based profile and the email-based profile into a single unified customer record.

## 7. Next Steps for Implementation

1.  **Select an SMS Service**: Choose between a direct API (like Twilio) or a specialized Shopify App (like miniOrange) that offers a headless-ready API.
2.  **Verify Plan Compatibility**: Confirm if the store has access to Multipass or if a Proxy approach is required.
3.  **UI Design**: Finalize the mobile-first login screens, ensuring clear feedback for code delivery and expiry.
