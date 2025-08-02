# 🧠 Game store Redis Round Structure

**Namespace Prefix:** `round:{roundId}`  
All game-related data is stored under a unified namespace
for easy traceability, efficient cleanup, and operational clarity.

---

## 🎲 1. Provably Fair Outcome

Each round generates a single provably fair outcome with
crash multipliers for each vehicle (`matatu` and `bodaboda`).

- 🔑 **Key Pattern:** `round:{roundId}:provablyFair`
- 📚 **Type:** Redis Hash

### 📦 Example Value:

```json
{
  "vehicle": {
    "serverSeed": "7f9a2c8e1b4d6f3a9c5e8b2d4f7a1c9e",
    "hashedServerSeed": "a1b2c3d4e5f6789012345678901234567890abcdef",
    "clientSeed": "user_contributed_randomness_2024",
    "clientSeedDetails": "[{\"userId\": \"user_12345\", \"seed\": \"my_random_string\"}]",
    "decimal": "67891234567890",
    "rawMultiplier": "2.84",
    "finalMultiplier": "2.80",
    "createdAt": "1735689600000"
  }
}
```

---

## 💸 2. Participants / Bets

All bets for a round are stored in a single hash, keyed by user ID.
Each value is a JSON object with bet details and vehicle type.

- 🔑 **Key Pattern:** `round:{roundId}:bets`
- 📚 **Type:** Redis Hash
- 🧑 **Field:** userId

### 📦 Example Value

````json
{
user123: {
"userId": "user123",
"stake": 40,
"payout": null,
"cashoutMultiplier": null,
"autoCashoutValue": 2.5,
"hasAutoCashout": true,
"status": "pending",
"ride": "bodaboda"
},

user456: {
"userId": "user456",
"stake": 100,
"payout": 250,
"cashoutMultiplier": 2.5,
"autoCashoutValue": 3.0,
"hasAutoCashout": true,
"status": "cashed_out",
"ride": "matatu"
}
}

'''
---

## 📊 3. Round Statistics

Summarized round metrics and metadata used for game logic, analytics, and historical exports.

- 🔑 **Key:** `round:{roundId}:stats`
- 📚 **Type:** Redis Hash

### 📦 Example Value

```json
{
  "totalBetsMatatu": "20",
  "totalBetsBoda": "15",
  "totalAmountMatatu": "8000",
  "totalAmountBoda": "5800",
  "totalCashoutsMatatu": "14",
  "totalCashoutsBoda": "12",
  "totalPayoutMatatu": "13400",
  "totalPayoutBoda": "10400",
  "bettingPhase": "closed",
  "roundStatus": "waiting_for_completion",
  "matatuStatus": "crashed",
  "bodabodaStatus": "active",
  "matatuCrashTime": "1722177150000",
  "bodabodaCrashTime": null,
  "roundStartTime": "1722177120000",
  "roundEndTime": null
}
````

---

## 🥇 4. Top Stakers

Sorted set to track the largest individual bettors for leaderboard or UI display.

- 🔑 **Key:** `round:{roundId}:topStakers`
- 📚 **Type:** Redis Sorted Set (ZSET)
- 🧮 **Score:** Stake amount
- 🧑 **Member:** userId

### 🧾 Example Entry

```
ZADD round:129383:topStakers 400 user123
```

---

## 🧹 Data Lifecycle & Cleanup

### 🔄 Flow

1. **Start of Round:** All game state keys are initialized in Redis.
2. **During Round:** Bets placed and updated in real-time.
3. **End of Round:** Data is aggregated and stored in the database via workers.
4. **Post-Save:** Keys are deleted to free memory.

### ⚠️ Important Note on Expiry

Avoid setting static TTLs. Use a post-persistence confirmation system:

- Delete keys **only after** database save is successful.
- You may use a background worker or job queue (e.g., BullMQ) to manage this safely.

---

## ✅ Summary Table

| Key Pattern                    | Type       | Description                         |
| ------------------------------ | ---------- | ----------------------------------- |
| `round:{roundId}:provablyFair` | Hash       | Seeds and generated multiplier      |
| `round:{roundId}:bets`         | Hash       | All user bets                       |
| `round:{roundId}:stats`        | Hash       | Stats about round outcomes and meta |
| `round:{roundId}:topStakers`   | Sorted Set | Top bettors sorted by stake amount  |

---

## 🔐 Notes on Data Design

- **JSON storage:** Complex values (like nested seed details or full bets) are stored using `JSON.stringify()` and parsed on retrieval.
- **Performance:** Since Redis is in-memory, access and updates are near-instant.
- **Cleanup:** Data is not persistent in Redis; it must be flushed to permanent DB at round end.

---

## 📎 Use Cases

- Frontend UI (live stats, cashouts, top stakers)
- Admin Panel (via DB, not Redis)
- Profit analytics (done via permanent DB, not Redis)
- Fairness verification via seeds

---

© Curix Game Architecture — 2025
