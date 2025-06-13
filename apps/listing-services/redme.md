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


---

# Property Ownership Types

Understanding the different types of property ownership is fundamental in real estate. These categories define the nature of rights and responsibilities held by the owner(s) over a piece of land or a unit within a building.

---

### 1. **Freehold**
* **Definition:** This is the most complete form of private property ownership. The owner holds the absolute right to the land and any buildings on it, indefinitely, without any time limit.
* **Key Characteristics:**
    * **Perpetual Ownership:** Ownership lasts forever, inherited by heirs.
    * **Full Control:** The owner has maximum control over the property, subject only to general planning laws and regulations (e.g., zoning, environmental laws).
    * **No Ground Rent:** Typically no ongoing rent is paid to a superior landlord (though property taxes and service charges for shared amenities may apply).
    * **Kenya Context:** Commonly referred to as "absolute ownership" and typically granted for terms exceeding 99 years, often effectively perpetual, though the specific legal term might be "fee simple" or similar, usually a grant for 999 years or freehold.

### 2. **Leasehold**
* **Definition:** Ownership of a property for a fixed period of time, as defined by a lease agreement. The leaseholder owns the right to occupy and use the property for the duration of the lease, but the land itself remains owned by the freeholder (landlord).
* **Key Characteristics:**
    * **Time-Limited:** Ownership reverts to the freeholder at the end of the lease term.
    * **Ground Rent:** Leaseholders typically pay ground rent to the freeholder.
    * **Lease Covenants:** Subject to the terms and conditions (covenants) stipulated in the lease agreement.
    * **Kenya Context:** Common for urban properties, particularly in larger cities. Leases are typically granted for 99 years for Kenyans and 99 years for non-Kenyans from the date of the grant. Renewals are often possible but not guaranteed.

### 3. **Strata Title / Condominium**
* **Definition:** A form of ownership primarily used for units within multi-unit developments (apartments, townhouses). The owner holds outright ownership of their individual unit, plus a proportional share of the common property (e.g., land, hallways, roofs, gardens, shared facilities like gyms or pools).
* **Key Characteristics:**
    * **Dual Ownership:** Individual unit ownership + shared ownership of common areas.
    * **Body Corporate/Management Company:** An owners' association (e.g., Management Company in Kenya, Body Corporate, HOA) manages and maintains the common areas, funded by service charges or levies from all unit owners.
    * **Kenya Context:** Increasingly common for apartments and gated communities. The legal framework often involves the registration of a management company that holds the reversionary interest of the land, while individual unit owners are granted long-term leases (e.g., 99 years) over their units and shares in the management company. This acts very similarly to a global condominium model.

### 4. **Commonhold (Primarily UK)**
* **Definition:** A modern alternative to leasehold for multi-unit properties. Unit owners own the freehold of their individual unit and collectively own and manage the common parts of the building through a commonhold association.
* **Key Characteristics:**
    * **Perpetual Unit Ownership:** Unlike leasehold, individual unit ownership is not time-limited.
    * **No Ground Rent:** No ground rent is paid to a superior landlord.
    * **Collective Management:** Owners democratically manage the building's common areas.
* **Note:** While similar in principle to Strata Title/Condominium, it's a specific legal framework primarily in the UK.

### 5. **Co-ownership (How multiple individuals hold an interest)**
These describe how multiple individuals hold a freehold or leasehold interest in a single property.

* **Joint Tenancy**
    * **Definition:** Two or more people own the entire property together with equal rights and interests.
    * **Key Characteristic:** Includes the "right of survivorship" – if one joint tenant dies, their share automatically passes to the surviving joint tenant(s), regardless of their will.
    * **Common Use:** Often used by married couples.

* **Tenancy in Common**
    * **Definition:** Two or more people own distinct, undivided shares of a property. These shares can be equal or unequal.
    * **Key Characteristic:** No right of survivorship – if one tenant in common dies, their share passes according to their will or the laws of intestacy, not automatically to the other co-owner(s).
    * **Common Use:** Friends or business partners buying property together, or family members who wish to ensure their share passes to their heirs.

### 6. **Trust Ownership**
* **Definition:** A property is legally owned by a trustee (an individual or entity) who holds the legal title, but manages it for the benefit of one or more beneficiaries who hold the equitable or beneficial interest.
* **Key Characteristics:**
    * **Separation of Legal & Beneficial Ownership:** The trustee has legal control, beneficiaries receive benefits.
    * **Purpose:** Often used for estate planning, asset protection, managing property for minors, or for charitable purposes.
    * **Kenya Context:** Trusts are legally recognized in Kenya and are used for various purposes, including land ownership.

### 7. **Company / Corporate Ownership**
* **Definition:** A legal entity (a company or corporation) owns the property. Individuals involved own shares in the company, which in turn owns the property.
* **Key Characteristics:**
    * **Limited Liability:** Owners of the company have limited liability for company debts.
    * **Ease of Transfer:** Ownership can be transferred by selling shares in the company, which can sometimes simplify property transfer processes.
    * **Tax Implications:** Specific tax treatments apply to company-owned properties.
    * **Kenya Context:** Very common for commercial properties, large developments, and sometimes for residential properties held by investors.

### 8. **Shared Ownership (Assisted Homeownership)**
* **Definition:** A model, often government-backed, where a buyer purchases a percentage of a property (e.g., 25% to 75%) and pays rent on the remaining percentage, which is owned by a housing association or similar body.
* **Key Characteristics:**
    * **Phased Ownership:** The buyer can typically buy additional shares over time ("staircasing") until they own the entire property.
    * **Affordability:** Designed to make homeownership more accessible for those who cannot afford to buy outright.
* **Kenya Context:** Similar concepts exist in Kenya through various affordable housing schemes or specific arrangements, though not always under this exact nomenclature.

### 9. **Customary Land Tenure (Highly Relevant in Kenya)**
* **Definition:** A traditional system of land ownership based on the customs, norms, and practices of a particular community, clan, or ethnic group. Land is often held communally, with individual rights to use or occupy land derived from membership in that community.
* **Key Characteristics:**
    * **Community/Clan Based:** Rights are rooted in community membership rather than individual title deeds initially.
    * **Unwritten Rules:** Historically governed by unwritten traditional laws, though increasingly being documented and recognized.
    * **Kenya Context:** This is a very significant form of land tenure in Kenya, especially in rural areas. The **Constitution of Kenya (2010)** and the **Community Land Act (2016)** explicitly recognize and provide for the registration of community land and customary land rights, aiming to formalize and secure these traditional forms of ownership.

---