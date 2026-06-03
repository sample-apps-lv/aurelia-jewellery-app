# Dynamic Jewelry Pricing System Documentation

This document outlines the strategy for implementing real-time price updates for jewelry products based on fluctuating gold and silver market rates within the Shopify ecosystem.

## 1. The Core Concept
Jewelry pricing is traditionally calculated using a formula rather than a static value. By storing the physical attributes of a product (weight, purity) and the current market rates separately, we can automate price updates across the entire catalog instantly.

**The Formula:**
`Product Price = [(Metal Weight × Current Market Rate) + Making Charges + Gemstone Value] × (1 + Tax/GST)`

---

## 2. Data Architecture

To make this work with Shopify, we will use **Metaobjects** for global rates and **Metafields** for product-specific data.

### A. Global Metal Rates (Metaobject)
We will create a Metaobject named `Metal Rates` in Shopify Admin.
- **Handle:** `metal_rates`
- **Fields:**
  - `gold_24k` (Decimal): Price per gram.
  - `gold_22k` (Decimal): Price per gram.
  - `gold_18k` (Decimal): Price per gram.
  - `silver` (Decimal): Price per gram.
  - `last_updated` (DateTime).

### B. Product Attributes (Metafields)
Every jewelry product will have the following metafields assigned:
- `custom.metal_type`: (Gold / Silver / Platinum).
- `custom.metal_purity`: (24k, 22k, 18k, 14k, etc.).
- `custom.metal_weight_grams`: The weight of the metal in the piece.
- `custom.making_charge`: The labor cost (can be fixed or per gram).
- `custom.gemstone_value`: Fixed cost of any diamonds or stones included.

---

## 3. Workflow Implementation

### Phase 1: Admin Price Management Dashboard
Instead of just a "global update," we will provide a **Pricing Preview Table** in your admin panel.
1. **Global Rate Inputs:** Admin enters the new rate for 24k, 22k, etc.
2. **Instant Preview:** The dashboard will instantly show a list of all products with:
   - **Current Price** (What is live on Shopify now).
   - **Calculated New Price** (Based on the formula).
   - **Difference** (+/- amount).
3. **Manual Override:** Admin can see the price for every single product and, if needed, tweak a specific product's price before saving.
4. **Action Button:** "Sync All Prices to Shopify".

### Phase 2: The "Formula Engine" (Behind the Scenes)
The reason we need the **Weight × Rate** formula is to solve the "Bulk Update" problem. 

**Without a formula:** If gold goes up, you would have to manually open 500 products and type a new price for each one because a ring and a necklace don't increase by the same amount.
**With the formula:** The system does the math for you. It knows that for "Product A" (2g), the price should increase by ₹200, but for "Product B" (10g), it should increase by ₹1000. 

You still "see the price" in the admin panel, but the system **suggests** the correct price based on the metal rate so you don't have to calculate it manually.

### Phase 3: Immediate Synchronization
- **Storefront:** Once you click "Sync," the actual "Price" and "MRP" fields on Shopify are updated. 
- **Transparency:** The admin panel will always display the exact Sellable Price and MRP that is currently live.

---

## 4. Why this approach?

1. **Native Shopify Compatibility:** By updating the actual "Price" field of the product, we ensure that Shopify's native Cart, Checkout, and Reports work perfectly without complex workarounds.
2. **Speed:** Using Shopify's Bulk Mutation API allows us to update thousands of products in seconds.
3. **Accuracy:** You only manage 4-5 numbers (the metal rates), and the system handles the math for thousands of items, reducing human error.
4. **Transparency:** We can display the "Gold Rate used for this price" on the product page to build trust with customers.

---

## 6. Mandatory Product Creation Fields

When adding a new product in the Admin Panel, the following fields must be filled to ensure the pricing engine can calculate the Sellable Price and MRP:

### A. Metal Specifications
- **Metal Type:** Dropdown (Gold, Silver, Platinum).
- **Metal Purity:** Dropdown (24k, 22k, 18k, 14k, Sterling Silver).
- **Metal Weight (Grams):** The actual weight of the metal.
- **Wastage % (Optional):** Many jewelers add 2-5% for metal loss during crafting.

### B. Cost Components
- **Making Charge:** Can be a **Fixed Amount** (e.g., ₹500 per piece) or **Per Gram** (e.g., ₹400/g).
- **Gemstone/Diamond Value:** Total fixed cost of any stones included in the design.
- **Other Charges:** Fixed costs like Hallmarking, Certification, or Packaging.

### C. Tax & Margin
- **GST %:** (Usually 3% for Jewelry in India).
- **Admin Margin %:** If you want the system to automatically add a profit margin to the base cost to generate the MRP.

---

## 7. How it works during Product Creation
1. Admin fills in the **Weight** (e.g., 10g) and **Purity** (e.g., 22k).
2. The system fetches the **Current Market Rate** automatically.
3. The system **pre-calculates** the Sellable Price in real-time on the "Add Product" screen.
4. Admin reviews the price, makes any manual adjustments, and clicks "Create Product."
