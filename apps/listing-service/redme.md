# Real Estate Listing Service

This service manages various types of property listings, separating the concerns of how properties are made available to the market from the properties themselves. The service supports multiple listing types to accommodate different real estate market needs.

## Table of Contents

- [Core Listing Model](#core-listing-model)
- [Listing Types](#listing-types)
  - [Sale Listing](#sale-listing)
  - [Rental Listing](#rental-listing)
  - [Lease Listing](#lease-listing)
  - [Short-Term Listing](#short-term-listing)
  - [Rent-to-Own Listing](#rent-to-own-listing)
  - [Co-Living Listing](#co-living-listing)

## Core Listing Model

The base listing model contains common fields used across all listing types.

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "propertyId": "987fced-a89b-12d3-a456-42661417400",
  "organizationId": "abc123...",
  "type": "SALE",
  "status": "ACTIVE",
  "title": "Modern 3 Bedroom Apartment in Kilimani",
  "description": "Spacious apartment with excellent city views...",
  "price": 15500000,
  "currency": "KES",
  "listedDate": "2025-02-01T10:00:00Z",
  "expiryDate": "2025-05-01T10:00:00Z",
  "featured": true
}
```

### Listing Status Types

- `DRAFT`: Initial creation state
- `ACTIVE`: Publicly visible
- `UNDER_CONTRACT`: Offer accepted/in progress
- `SOLD`: Property sold
- `LEASED`: Property leased
- `RENTED`: Property rented
- `WITHDRAWN`: Temporarily removed
- `EXPIRED`: Past expiry date

## Listing Types

### Sale Listing

Suitable for property sales in premium areas like Kilimani, Kileleshwa, or Runda.

```json
{
  "id": "123...",
  "listingId": "456...",
  "downPayment": 1550000,
  "mortgageAvailable": true,
  "priceNegotiable": true,
  "ownershipType": "Freehold",
  "titleDeedReady": true,
  "financingOptions": ["Cash", "Mortgage", "Installments"]
}
```

Key features:

- Down payment tracking
- Mortgage availability
- Title deed status
- Flexible financing options

### Rental Listing

Ideal for residential rentals in areas like Westlands or Lavington.

```json
{
  "rentPeriod": "Monthly",
  "minimumRentalPeriod": 12,
  "securityDeposit": 150000,
  "petsAllowed": false,
  "furnished": true,
  "utilities": ["Water", "Security", "Garbage Collection"],
  "availableFrom": "2025-03-01T00:00:00Z",
  "additionalCharges": [
    {
      "description": "Service Charge",
      "amount": 5000,
      "frequency": "monthly"
    }
  ]
}
```

Key features:

- Flexible rental periods
- Utility inclusion management
- Additional charges tracking
- Pet and furnishing status

### Lease Listing

Designed for commercial properties in CBD or Upperhill.

```json
{
  "leaseTerm": 60,
  "securityDeposit": 1000000,
  "maintenanceTerms": "Tenant responsible for internal maintenance...",
  "isCommercial": true,
  "buildOutAllowance": 2000000,
  "allowedUses": ["Office", "Medical Facility", "Educational Institution"]
}
```

Key features:

- Long-term lease management
- Commercial property support
- Build-out allowances
- Usage restrictions

### Short-Term Listing

Perfect for holiday homes in areas like Diani Beach or Malindi.

```json
{
  "minimumStay": 2,
  "maximumStay": 30,
  "basePrice": 15000,
  "weeklyDiscount": 10.0,
  "monthlyDiscount": 20.0,
  "cleaningFee": 2000,
  "securityDeposit": 10000,
  "selfCheckIn": true,
  "breakfast": true,
  "availabilityCalendar": {
    "blockedDates": ["2025-12-24", "2025-12-25"],
    "specialPricing": {
      "2025-12-31": 25000
    }
  }
}
```

Key features:

- Flexible stay duration
- Dynamic pricing
- Service options
- Availability management

### Rent-to-Own Listing

Popular in developing areas like Syokimau or Athi River.

```json
{
  "totalPurchasePrice": 8000000,
  "monthlyRent": 45000,
  "rentCredits": 20000,
  "optionFee": 400000,
  "optionPeriod": 36,
  "requiredDownPayment": 800000,
  "minimumIncome": 150000,
  "creditScoreRequired": 650
}
```

Key features:

- Purchase price tracking
- Rent credit management
- Option terms
- Financial requirements

### Co-Living Listing

Suitable for student areas near universities like USIU or young professional hubs like Ruaka.

```json
{
  "roomType": "Private",
  "totalOccupancy": 4,
  "currentOccupancy": 2,
  "privateSpace": 15.5,
  "sharedSpace": 80.0,
  "communityAmenities": ["High-Speed WiFi", "Study Room", "Entertainment Area"],
  "minimumStay": 6,
  "genderPreference": "Female",
  "occupation": "Student",
  "securityDeposit": 30000,
  "utilitiesIncluded": ["Water", "Electricity", "WiFi"],
  "communityGuidelines": "Quiet hours after 10 PM..."
}
```

Key features:

- Occupancy management
- Community features
- Living preferences
- Shared space details

## Usage Notes

1. Each listing type extends the core listing model
2. All monetary values are stored in smallest currency unit
3. Dates are stored in ISO 8601 format
4. JSON fields allow for flexible additional data storage
5. Soft deletion is implemented via the `voided` field

## Database Considerations

1. Indexes are recommended on:

   - `propertyId`
   - `organizationId`
   - `status`
   - `type`
   - `price` (for range queries)
   - `listedDate`

2. Foreign key constraints:
   - Each listing type references the main listing via `listingId`
   - Cascade deletion is enabled

## Best Practices

1. Always validate currency codes against ISO 4217
2. Implement proper decimal handling for monetary values
3. Use timezone-aware datetime handling
4. Validate JSON fields against predefined schemas
5. Implement proper security deposit handling

## Auction

### 1️⃣ Starting Bid (startingBid)

- The starting bid is the lowest possible bid a buyer can place.
- It’s usually set lower than the actual market value to attract more bidders.
- The higher the demand, the more bids a property will receive.

- 💡 Example:
  A 3-bedroom house in Nairobi has a market value of KES 10M, but the auction starting bid is set at KES 6M to encourage interest.

### 2️⃣ Reserve Price (reservePrice)

- The reserve price is the minimum amount the seller is willing to accept.
- If the highest bid is lower than the reserve price, the property won’t be sold.
- If there’s no reserve price, the highest bid automatically wins.
- 💡 Example:
  - If the starting bid is KES 6M, but the reserve price is KES 8M,
  - then: If the highest bid is KES 7.5M, the property is not sold.
  - If a bidder places KES 8M or more, the property is sold to them.

### 3️⃣ Bid Increment (bidIncrement)

- The bid increment is the minimum amount a new bid must exceed the previous bid.
- It prevents small, insignificant increases (e.g., KES 1).
- It can be fixed (KES 100,000) or percentage-based (e.g., 5% of current bid).
- 💡 Example:
  If the current bid is KES 6.5M, and the bid increment is KES 100,000, the next bid must be at least KES 6.6M.

### 4️⃣ Auction Start Date (auctionStart)

- Specifies when the auction officially begins.
- Bidders cannot place bids before this date.
- 💡 Example:
  A property auction starts on August 10, 2025, at 10:00 AM.

### 5️⃣ Auction End Date (auctionEnd)

- The deadline for bidding.
- After this time, no new bids are accepted.
- 💡 Example:
  The auction ends on August 17, 2025, at 5:00 PM.

### 6️⃣ Pre-Registration Required (preRegistration)

- If true, bidders must register before placing bids.
- This helps prevent spam and fraud by verifying participants.
- 💡 Example:
  If preRegistration = true, bidders must submit identity documents (e.g., National ID, KRA PIN, or proof of funds) before the auction.

### 7️⃣ Bidder Approval Required (bidderApproval)

- If true, bidders must be approved before participating.
- Used for high-value properties or exclusive auctions.
- 💡 Example:
  A KES 50M luxury home auction requires bidder approval to ensure serious buyers only.
