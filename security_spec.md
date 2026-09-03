# Security Specification & Data Invariants

## Architecture Overview
This security specification details the Attribute-Based Access Control (ABAC), Role-Based Access Control (RBAC), and Zero-Trust database security policies for the Aura Commerce web platform.

---

## 1. Data Invariants

1. **Catalog Integrity**:
   - Products are publicly readable by any client (`allow read: if true`).
   - Products can only be created, modified, or deleted by authenticated administrators (`isAdmin()`).
   - A product's price and stock must always be non-negative numbers.
   - A product's SKU must be unique, non-empty, and conform to `^[a-zA-Z0-9_\-]+$`.

2. **Order Immutability & Customer Privacy (PII Isolation)**:
   - Orders can only be read by the user who created them (`resource.data.userId == request.auth.uid`) or by an administrator (`isAdmin()`).
   - Once an order reaches a terminal state (`Delivered` or `Cancelled`), its status cannot be modified by standard customers.
   - Customers cannot alter `total`, `itemsCount`, or `userId` after order creation.
   - Order creation requires `request.auth.uid == incoming().userId` to prevent spoofing.

3. **Admin Privilege Escalation Protection**:
   - The `/admins/{adminId}` collection cannot be modified from client SDKs.
   - No customer can self-assign `admin` role or alter administrative records.

---

## 2. The "Dirty Dozen" Malicious Payloads (Penetration Test Cases)

| # | Attack Vector | Malicious Payload Attempt | Expected Outcome | Security Guard |
|---|---------------|---------------------------|------------------|----------------|
| 1 | **ID Poisoning** | `POST /products/$$$BAD%20ID$$$` with 2KB string | `PERMISSION_DENIED` | `isValidId(productId)` regex & length constraint |
| 2 | **Price Manipulation** | `POST /orders/` with `subtotal: 0.01` for $1,200 items | `PERMISSION_DENIED` | Server validation & positive price rules |
| 3 | **Order Spoofing** | Customer A creates order with `userId: "customer_b_uid"` | `PERMISSION_DENIED` | `incoming().userId == request.auth.uid` |
| 4 | **Ghost Field Injection** | `PATCH /products/p1` with `{ isPromoted: true, bypassStock: true }` | `PERMISSION_DENIED` | Strict keys check `data.keys().hasAll()` & size matching |
| 5 | **Admin Privilege Escalation**| Normal user writes to `/admins/$(request.auth.uid)` | `PERMISSION_DENIED` | `allow write: if false` on admins collection |
| 6 | **PII Data Harvest** | Unauthenticated user calls `GET /orders` list | `PERMISSION_DENIED` | `allow list: if isSignedIn() && resource.data.userId == request.auth.uid` |
| 7 | **Terminal State Reversal** | Customer cancels delivered package: `PATCH /orders/o1` { status: "Pending" } | `PERMISSION_DENIED` | Terminal state lock `existing().status != 'Delivered'` |
| 8 | **Denial of Wallet Attack** | Product description sent as 5MB string | `PERMISSION_DENIED` | `data.description.size() <= 2000` |
| 9 | **Stock Tampering** | Customer attempts `PATCH /products/p1` { stock: 9999 } | `PERMISSION_DENIED` | Non-admin writes rejected |
| 10| **Email Spoofing** | Write with `email: "admin@auracommerce.com"` with `email_verified: false` | `PERMISSION_DENIED` | `request.auth.token.email_verified == true` gate |
| 11| **Negative Inventory Injection** | Product created with `stock: -50` | `PERMISSION_DENIED` | `incoming().stock >= 0` check |
| 12| **Orphaned Order Creation** | Order references non-existent product ID | `PERMISSION_DENIED` | Client schema validator & existence verification |

---

## 3. Red Team Verification Matrix
- **Identity Integrity**: Passed (All write requests bound to `request.auth.uid`).
- **Resource Poisoning**: Passed (All inputs capped with `.size()` constraints).
- **Update Gap Defense**: Passed (`isValidProduct` and `isValidOrder` invoked on both Create and Update).
