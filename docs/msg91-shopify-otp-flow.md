# Msg91 & Shopify OTP Authentication Flow

This document details the step-by-step technical and user flow for authenticating customers using **Msg91** for SMS OTP and **Shopify** for session management.

## 1. The 4-Step User Journey

1.  **Entry**: User enters their 10-digit mobile number on the Gajanand Jewellers login page.
2.  **Dispatch**: The application calls Msg91 to send a 6-digit OTP to the user's phone.
3.  **Verification**: User enters the code; the application validates it via Msg91.
4.  **Login**: Once verified, the application "bridges" the identity to Shopify and logs the user in.

---

## 2. Technical Architecture Flow

### Phase 1: Requesting the OTP
*   **Action**: User clicks "Send OTP".
*   **Frontend**: Sends the phone number to a server function (e.g., `sendOtpFn`).
*   **Server**: Calls the **Msg91 SendOTP API**.
    *   *Payload*: Phone number, Sender ID (from DLT), and Template ID.
*   **Result**: Msg91 sends the SMS; the server returns a "Success" flag to the frontend.

### Phase 2: Verifying the OTP
*   **Action**: User enters the 6-digit code and clicks "Verify".
*   **Frontend**: Sends the phone number and the code to a server function (e.g., `verifyOtpFn`).
*   **Server**: Calls the **Msg91 VerifyOTP API**.
*   **Result**: 
    *   If **Invalid**: Server returns an error; frontend prompts the user to retry.
    *   If **Valid**: Server proceeds to the Shopify Bridge (Phase 3).

### Phase 3: The Shopify Bridge (Session Creation)
After Msg91 confirms the phone number is valid, the server must log the user into Shopify.

1.  **Lookup**: The server uses the **Shopify Admin API** to find a Customer with that verified phone number.
2.  **Customer Management**:
    *   If the customer **exists**: Retrieve their Shopify ID.
    *   If the customer is **new**: Create a new Shopify Customer profile with that phone number.
3.  **Token Generation**:
    *   **Shopify Plus**: The server generates a **Multipass Token** for the customer.
    *   **Standard Shopify**: The server uses a "Proxy Login" strategy (generating a `customerAccessToken` via a secure backend process).
4.  **Completion**: The server returns the Shopify session token to the frontend and sets a secure cookie.

---

## 3. Communication Diagram (Conceptual)

```text
[ User ] <--> [ Frontend (App) ] <--> [ Backend (Server) ]
                                             |
                                             |---(A)---> [ Msg91 API ]
                                             |
                                             |---(B)---> [ Shopify API ]
```

*   **(A) OTP Management**: Handled entirely by Msg91.
*   **(B) Identity & Session**: Handled entirely by Shopify.
*   **The Backend**: Acts as the "Glue" that ensures Shopify only logs the user in *after* Msg91 confirms the phone number is valid.

---

## 4. Why this flow is secure

*   **No "Leaked" Codes**: The OTP never touches the frontend until the user types it in.
*   **Administrative Control**: The login is only triggered by the backend after Msg91 validation, preventing users from "faking" a login.
*   **Shopify Integrity**: You continue to use Shopify as the "Source of Truth" for all customer data, orders, and addresses.

## 5. Implementation Requirements

*   **Msg91 API Key**: To authenticate your server with Msg91.
*   **DLT Approved Template**: The exact SMS text approved on the Indian DLT portal.
*   **Shopify Admin API Credentials**: To search and create customers based on phone numbers.
*   **TanStack Start Server Functions**: To securely bridge the two services.
