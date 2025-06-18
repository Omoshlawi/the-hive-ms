## 🧱 `Appointment` — The Core Model

Represents any kind of booking: viewing, inspection, legal signing, etc.

| Field                                | Purpose                                | Example                                         |
| ------------------------------------ | -------------------------------------- | ----------------------------------------------- |
| `id`                                 | Unique ID for the appointment          | `a4f9...`                                       |
| `title`                              | Brief purpose                          | `"Viewing at Greenview Apartments"`             |
| `description`                        | Optional details                       | `"Client wants to see both units"`              |
| `startTime` / `endTime`              | Time boundaries                        | `2025-06-06T10:00` → `2025-06-06T10:30`         |
| `timezone`                           | Timezone for consistency               | `"Africa/Nairobi"`                              |
| `duration`                           | Auto-calculated or fixed               | `30` (minutes)                                  |
| `status`                             | Booking lifecycle                      | `SCHEDULED`, `CONFIRMED`, `CANCELLED`           |
| `priority`                           | Internal importance marker             | `HIGH` for closing, `LOW` for follow-up         |
| `appointmentTypeId`                  | Foreign key → what kind of appointment | Points to `Property Viewing` or `Legal Signing` |
| `organizerId`                        | Who created it                         | Agent’s user ID                                 |
| `organizer`                          | Cached user info                       | `{ name: "Julita", email: "..." }`              |
| `participants[]`                     | Attendees                              | Buyer, co-agent, seller                         |
| `resources[]`                        | Booked things (property, equipment)    | Unit #304, camera, car                          |
| `metadata`                           | Custom info per type                   | `{ "petsAllowed": false }`                      |
| `location`                           | Physical/virtual address info          | See `AppointmentLocation`                       |
| `notifications[]`                    | Reminders, confirmations, etc.         | Email & SMS                                     |
| `recurrenceRule`                     | Recurring event logic                  | `"FREQ=WEEKLY;BYDAY=FR"`                        |
| `parentId` / `children[]`            | Links recurring series                 | Master appointment ID                           |
| `cancelledAt` / `cancellationReason` | Audit                                  | `client got COVID`                              |
| `rescheduledFrom`                    | Track previous appointment             | `"prev-id"`                                     |
| `createdBy`                          | Who logged it                          | `"agentId"`                                     |

---

## 🎯 `AppointmentType`

Defines templates of appointments.

| Field                       | Purpose                      | Example                               |
| --------------------------- | ---------------------------- | ------------------------------------- |
| `id`, `name`, `description` | Core info                    | `"Viewing"`, `"Property walkthrough"` |
| `category`                  | Broader grouping             | `PROPERTY_VIEWING`, `CONSULTATION`    |
| `defaultDuration`           | Suggested length             | 30 min                                |
| `bufferTimeBefore/After`    | Avoid tight overlaps         | 15 min gap between appointments       |
| `allowOnlineBooking`        | Public/self-booking toggle   | `true` for showings                   |
| `requiresApproval`          | Manual confirmation required | `true` for inspections                |
| `maxParticipants`           | Limits                       | 3 people max                          |
| `availabilityRules`         | Custom time rules            | `"Mon-Fri, 9-5"`                      |
| `requiredFields`            | Custom validations           | `"must provide ID card"`              |
| `baseCost` / `currency`     | Monetization                 | `50.00`, `"USD"`                      |

---

## 👥 `AppointmentParticipant`

Represents every person in the meeting.

| Field                     | Purpose                          | Example                                    |
| ------------------------- | -------------------------------- | ------------------------------------------ |
| `appointmentId`, `userId` | Links participant to appointment |                                            |
| `user`                    | Cached info                      | `{ name: "John Doe" }`                     |
| `role`                    | Their function                   | `ORGANIZER`, `ATTENDEE`, `RESOURCE_PERSON` |
| `status`                  | RSVP                             | `PENDING`, `ACCEPTED`                      |
| `isRequired`              | Can they be skipped?             | `true` for main client                     |
| `respondedAt`             | RSVP time                        | `2025-06-01T12:00`                         |
| `notes`                   | Extra info                       | `"Bring bank statements"`                  |

---

## 🏠 `Resource` & `AppointmentResource`

Resources you can schedule.

| Field         | Purpose             | Example                        |
| ------------- | ------------------- | ------------------------------ |
| `id`, `name`  | What’s being booked | `"Unit 3B - Coral Apartments"` |
| `type`        | Nature of resource  | `PROPERTY`, `VEHICLE`, `ROOM`  |
| `capacity`    | People limit        | `5`                            |
| `isBookable`  | Booking toggle      | `false` if under renovation    |
| `address/geo` | Location data       | `"Mbagathi Way"`               |
| `metadata`    | Details             | `{ furnished: true }`          |

---

## 📍 `AppointmentLocation`

Supports both **physical** and **virtual** formats.

| Field                     | Purpose                         | Example                         |
| ------------------------- | ------------------------------- | ------------------------------- |
| `type`                    | `PHYSICAL`, `VIRTUAL`, `HYBRID` |                                 |
| `address`, `city`, etc.   | For in-person meetups           | `"Karen, Nairobi"`              |
| `meetingUrl`, `meetingId` | Online meetings                 | Zoom link                       |
| `instructions`            | Additional info                 | `"Ask for Julita at reception"` |

---

## ⏰ `AvailabilitySlot`

Tracks when users are available.

| Field                   | Purpose             | Example                  |
| ----------------------- | ------------------- | ------------------------ |
| `userId`, `user`        | Who is available    | Agent ID                 |
| `startTime` / `endTime` | Availability window | `8am → 5pm`              |
| `recurrenceRule`        | Weekly slots        | `"FREQ=WEEKLY;BYDAY=TU"` |
| `isActive`              | Is this slot in use | `false` if on leave      |

---

## 🔔 `AppointmentNotification`

Represents messages sent to users.

| Field                | Purpose                  | Example                    |
| -------------------- | ------------------------ | -------------------------- |
| `type`               | Why notification is sent | `REMINDER`, `INVITATION`   |
| `channel`            | Delivery method          | `EMAIL`, `SMS`, `IN_APP`   |
| `recipient`          | Where to send            | `"john@example.com"`       |
| `scheduledFor`       | When to send             | 30 mins before event       |
| `subject`, `message` | Content                  | `"Reminder: 11AM Viewing"` |
| `status`             | Delivery status          | `SENT`, `FAILED`           |

---

## 🧭 Enums Summary

| Enum                  | Purpose                                  |
| --------------------- | ---------------------------------------- |
| `AppointmentStatus`   | Full lifecycle stages                    |
| `AppointmentCategory` | Logical grouping (viewing, consultation) |
| `Priority`            | Triage system                            |
| `ParticipantRole`     | Roles in event                           |
| `ResourceType`        | Type of thing being booked               |
| `LocationType`        | Physical vs. Virtual                     |
| `NotificationType`    | Why you're notified                      |
| `NotificationChannel` | How you're notified                      |
| `NotificationStatus`  | Was the message delivered?               |

---
