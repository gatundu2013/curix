# 🧠 User Store Redis Structure

**Namespace Prefix:** `user:{userId}`  
User-related data is managed in Redis with optimized separation between high-frequency updates (balances) and rarely changing details (profile info) for performance and clarity.

---

## 💰 1. User Balances

User balances are stored in a centralized hash for fast access and atomic updates.

- 🔑 **Key:** `user:balances`
- 📚 **Type:** Redis Hash
- 🧑 **Field:** userId
- 💵 **Value:** Balance (stringified number)

### 📦 Example Value

```json
{
  "user123": "1250.50",
  "user456": "340.75",
  "user789": "2100.00",
  "user101": "89.25"
}
```

---

## 👤 2. User Profiles

Each user has an individual hash for their profile information.

- 🔑 **Key Pattern:** `user:{userId}:profile`
- 📚 **Type:** Redis Hash
- 🧾 **Fields:** username,phoneNumber, etc.

### 📦 Example Value

```json
{
  "phoneNumber": "0796549576",
  "username": "johndoe"
}
```

---

## 📎 Use Cases

- **🔄 Betting & Cashouts:** Fast balance updates via `HINCRBYFLOAT`
- **👤 Account Display:** Profile data fetched on login or profile view
- **📊 Admin Dashboard:** Read-only info for support and moderation

---

## ✅ Summary Table

| Key / Pattern           | Type | Description                  |
| ----------------------- | ---- | ---------------------------- |
| `user:balances`         | Hash | Stores all user balances     |
| `user:{userId}:profile` | Hash | Stores per-user profile data |

---

© Curix Game Architecture — 2025
