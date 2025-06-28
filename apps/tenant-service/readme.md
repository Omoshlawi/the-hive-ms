# 🏡 Tenant Service - Prisma Schema Documentation

This document provides a comprehensive overview of the **Prisma models** used in the **Tenant Service**, which powers tenant management, applications, leases, screening, and verification in a real estate platform.

---

## 📁 Overview

The Tenant Service handles:

* Tenant profiles and preferences
* Rental applications and co-applicants
* Screening processes and evaluations
* References and background checks
* Lease and document management
* Audit trails and status history

All models are designed for **modularity**, **multi-tenancy**, and **microservice integration** (e.g., with Person, Listing, Lease, Property services).

---

## 📦 Core Models

### ### `Tenant`

Tracks a tenant's details including links to their `Person` identity, status, rental activity, and verification.

| Field                  | Type              | Description                                                      | Example                |
| ---------------------- | ----------------- | ---------------------------------------------------------------- | ---------------------- |
| id                     | String            | UUID of the tenant                                               | `"84fb..."`            |
| personId               | String            | Reference to the `Person` service                                | `"a8bc..."`            |
| tenantNumber           | String?           | Internal unique tenant number                                    | `"TNT-001"`            |
| tenantType             | TenantType        | Type of tenant                                                   | `INDIVIDUAL`           |
| status                 | TenantStatus      | Current status of tenant                                         | `ACTIVE`               |
| creditScore            | Int?              | Credit score if available                                        | `720`                  |
| monthlyIncome          | Decimal?          | Verified monthly income                                          | `4500.00`              |
| employmentStatus       | EmploymentStatus? | Employment type                                                  | `EMPLOYED_FULL_TIME`   |
| emergencyContact\*     | String?           | Emergency details                                                | `"John Doe"` + contact |
| preferredContactMethod | ContactMethod     | Preferred contact mode                                           | `EMAIL`                |
| languagePreference     | String?           | Preferred language                                               | `"en"`                 |
| specialRequirements    | String?           | Notes like accessibility or pet needs                            | `"Wheelchair access"`  |
| ...                    | ...               | Includes background checks, documents, references, history, etc. |                        |

---

### `RentalApplication`

Represents a tenant’s intent to rent a unit with associated screening, co-applicants, and evaluations.

| Field             | Type              | Description               | Example        |
| ----------------- | ----------------- | ------------------------- | -------------- |
| id                | String            | UUID                      | `"a12f..."`    |
| tenantId          | String            | Reference to Tenant       | `"84fb..."`    |
| propertyId        | String            | Link to actual property   | `"12af..."`    |
| listingId         | String            | Link to marketing listing | `"9812..."`    |
| desiredMoveInDate | DateTime          | Target date of move-in    | `"2025-07-01"` |
| leaseTerm         | Int?              | Months intended to stay   | `12`           |
| proposedRent      | Decimal?          | Tenant's offer            | `"2500.00"`    |
| screeningScore    | Decimal?          | Result from screening     | `89.00`        |
| status            | ApplicationStatus | Workflow status           | `PENDING`      |

---

## 🔄 Status Tracking Models

### `TenantStatusHistory`, `RentalApplicationStatusHistory`, `TenantLeaseStatusHistory`

Track changes in status with timestamps, actor, and reason.

| Field          | Type    | Description          |
| -------------- | ------- | -------------------- |
| previousStatus | Enum    | Old state            |
| newStatus      | Enum    | Updated state        |
| changedBy      | String? | User who made change |
| reason         | String? | Why change was made  |

---

## 📚 Supporting Models

### `TenantReference`

Holds personal or professional references for the tenant.

### `CoApplicant`

Defines an additional applicant attached to an application.

### `TenantLease`

Links tenants to leases and tracks participation.

### `TenantDocument`

Stores tenant-uploaded and system-required documents.

### `ScreeningQuestion` & `ScreeningResponse`

Defines screening workflows and stores user answers with scoring.

### `ScreeningQuestionTemplate`

Reusable templates for rapid screening config setup.

### `ListingScreeningConfig`

Configures screening per listing: score thresholds, auto-approve, notifications.

---

## 📘 Enums & Classifications

| Enum                    | Description                         |
| ----------------------- | ----------------------------------- |
| `TenantType`            | INDIVIDUAL, FAMILY, CORPORATE, etc. |
| `EmploymentStatus`      | EMPLOYED\_FULL\_TIME, STUDENT, etc. |
| `BackgroundCheckStatus` | PENDING, APPROVED, REJECTED         |
| `TenantStatus`          | ACTIVE, FORMER, BLACKLISTED         |
| `ApplicationStatus`     | DRAFT, PENDING, APPROVED, etc.      |
| `DocumentType`          | ID\_DOCUMENT, BANK\_STATEMENT, etc. |
| `QuestionType`          | TEXT, MULTI\_SELECT, SLIDER, etc.   |
| `QuestionCategory`      | EMPLOYMENT, INCOME, PETS, etc.      |

---

## ✅ Design Principles

* **Auditability**: Historic changes tracked on status models.
* **Data separation**: Clean responsibility boundaries per concern.
* **Multi-tenancy ready**: Models are org-aware via `organizationId`.
* **Extensible**: New features can plug into this model set (e.g. scoring rules).

---

## 📈 Roadmap Ideas

* Build UI for screening templates and live application review.
* Add tenant scoring engine with customizable weight configuration.
* Integrate document upload/verification via external storage service.

---

For contributions or questions, please refer to the `tenant-service` repository or reach out to the backend architecture team.
