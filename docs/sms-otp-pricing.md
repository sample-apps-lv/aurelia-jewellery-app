# SMS OTP Providers & Pricing Comparison (2024)

This document provides a detailed comparison of third-party SMS providers to help select the most cost-effective and reliable solution for mobile OTP login in India.

## 1. Provider Comparison Overview

| Provider | Model | Approx. Cost (India) | Billing Currency |
| :--- | :--- | :--- | :--- |
| **Msg91** | Per OTP | **₹0.20 – ₹0.25** | **INR (₹)** |
| **Twilio** | Per Success | ₹1.50 – ₹2.50 | USD ($) |
| **Vonage** | Per Success | ₹4.75 | USD ($) |
| **miniOrange** | Subscription | $49/mo + ₹0.83/SMS | USD ($) |

---

## 2. Detailed Provider Analysis

### Msg91 (Cheapest & India-Specialized)
Msg91 is the clear price leader for businesses operating primarily in India.
*   **Pricing:** Transactional SMS ranges from ₹0.15 to ₹0.25.
*   **Pros:** Native INR billing, 18% GST tax invoices, and integrated DLT support.
*   **Cons:** Dashboard is less developer-friendly compared to Twilio.

### Twilio (Global Standard)
The most popular choice for global applications, but comes at a significant premium for the Indian market.
*   **Pricing:** Uses a USD-based model. Their "Verify" service (which manages code generation/expiry) adds a fee on top of the base SMS cost.
*   **Pros:** World-class documentation, robust security features, and easy global delivery.
*   **Cons:** Roughly 6x-10x more expensive than local Indian providers.

### Vonage (Enterprise Choice)
Best for large enterprises that prioritize high delivery rates and failover options over unit cost.
*   **Pricing:** Uses a "Pay-per-success" model. While the unit price is high (~₹4.75), you do not pay for failed attempts or retries.
*   **Pros:** Automatic "Voice Fallback" (calls the user if SMS fails) and high-end fraud protection.
*   **Cons:** Most expensive option for high-volume Indian traffic.

### miniOrange (Low-Code App)
A specialized Shopify App that acts as middleware.
*   **Pricing:** High entry cost due to the $49/month platform fee.
*   **Pros:** Best if you do not want to write any integration code. It handles the Shopify Customer database mapping out-of-the-box.
*   **Cons:** Overkill if you already have developer resources to write a custom bridge.

---

## 3. Estimated Monthly Cost (1,000 Logins)

| Provider | Estimated Monthly Cost |
| :--- | :--- |
| **Msg91** | **₹250** |
| **Twilio** | **₹2,000** |
| **Vonage** | **₹4,750** |
| **miniOrange** | **₹4,850+** |

---

## 4. Critical Indian Compliance: DLT

In India, the Telecom Regulatory Authority (TRAI) mandates **DLT (Distributed Ledger Technology)** registration for all businesses sending commercial SMS.

*   **Registration Fee**: A one-time fee of approx. **₹5,900** paid to a telecom portal (e.g., Jio, Airtel, or BSNL).
*   **Header (Sender ID)**: You must register your 6-character alphabetic Sender ID (e.g., `GAJANJ`).
*   **Template Approval**: Every SMS message (including the OTP text) must be pre-approved by the DLT portal before it can be sent.

## 5. Recommendation

For **Gajanand Jewellers**, the recommended provider is **Msg91**.

1.  **Lowest Cost**: Significant savings compared to global providers.
2.  **Simplified Compliance**: They provide the most streamlined guidance for the mandatory Indian DLT registration process.
3.  **Local Tax Compliance**: Ability to claim 18% GST Input Tax Credit.
4.  **Omnichannel Fallback**: Easily supports WhatsApp or Voice OTP if the user is in a low-network area.
