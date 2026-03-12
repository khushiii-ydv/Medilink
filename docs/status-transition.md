# MediLink Status Transition

## Overview

This document defines the **allowed status lifecycle** for MediLink backend entities.
It replaces the missing `status-transition.md` and should be treated as the source of truth for:

- validation rules
- backend guards
- audit logging
- notification triggers
- real-time socket events

---

## 1. Admission Request Status

Admission requests are created by **patients** and handled by **hospital staff**.

### Allowed statuses

- `PENDING`
- `UNDER_REVIEW`
- `ACCEPTED`
- `REJECTED`
- `CANCELLED`
- `EXPIRED`

### Default status

- `PENDING`

### Allowed transitions

| Current Status | Next Allowed Status | Triggered By |
|---|---|---|
| PENDING | UNDER_REVIEW | Hospital Staff |
| PENDING | ACCEPTED | Hospital Staff |
| PENDING | REJECTED | Hospital Staff |
| PENDING | CANCELLED | Patient |
| PENDING | EXPIRED | System |
| UNDER_REVIEW | ACCEPTED | Hospital Staff |
| UNDER_REVIEW | REJECTED | Hospital Staff |
| UNDER_REVIEW | CANCELLED | Patient |
| UNDER_REVIEW | EXPIRED | System |

### Terminal statuses

- `ACCEPTED`
- `REJECTED`
- `CANCELLED`
- `EXPIRED`

### Business rules

1. A patient can cancel only their own request.
2. Hospital staff can act only on requests addressed to their hospital.
3. Expiry should be system-driven when no response is received within a configured time window.
4. Once accepted, bed allocation should be reserved through a database transaction.
5. Rejected requests should store an optional `rejection_reason`.

### Suggested socket / notification events

- `admission.request.created`
- `admission.request.updated`
- `admission.request.accepted`
- `admission.request.rejected`
- `admission.request.expired`

---

## 2. Hospital-to-Hospital Request Status

Hospital requests include:

- patient transfer
- blood request
- equipment request
- emergency support request

### Allowed statuses

- `PENDING`
- `VIEWED`
- `ACCEPTED`
- `REJECTED`
- `FULFILLED`
- `CANCELLED`
- `EXPIRED`

### Default status

- `PENDING`

### Allowed transitions

| Current Status | Next Allowed Status | Triggered By |
|---|---|---|
| PENDING | VIEWED | Receiver Hospital |
| PENDING | ACCEPTED | Receiver Hospital |
| PENDING | REJECTED | Receiver Hospital |
| PENDING | CANCELLED | Sender Hospital |
| PENDING | EXPIRED | System |
| VIEWED | ACCEPTED | Receiver Hospital |
| VIEWED | REJECTED | Receiver Hospital |
| VIEWED | CANCELLED | Sender Hospital |
| VIEWED | EXPIRED | System |
| ACCEPTED | FULFILLED | Receiver Hospital / System |
| ACCEPTED | CANCELLED | Sender Hospital |

### Terminal statuses

- `REJECTED`
- `FULFILLED`
- `CANCELLED`
- `EXPIRED`

### Business rules

1. Sender hospital cannot approve its own request.
2. Receiver hospital must not be the same as sender hospital.
3. Transfer acceptance should validate live resource availability before final approval.
4. For blood/equipment requests, the accepted quantity should be stored separately from requested quantity.
5. A request marked `FULFILLED` must store `fulfilled_at` timestamp.

### Suggested socket / notification events

- `hospital.request.created`
- `hospital.request.viewed`
- `hospital.request.accepted`
- `hospital.request.rejected`
- `hospital.request.fulfilled`

---

## 3. Ambulance Request Status

Ambulance requests may be created by **patients** or **hospital staff** and handled by an **ambulance driver**.

### Allowed statuses

- `PENDING`
- `ASSIGNED`
- `ACCEPTED`
- `REJECTED`
- `ARRIVING`
- `PICKED_UP`
- `DROPPED`
- `COMPLETED`
- `CANCELLED`
- `EXPIRED`

### Default status

- `PENDING`

### Allowed transitions

| Current Status | Next Allowed Status | Triggered By |
|---|---|---|
| PENDING | ASSIGNED | System / Hospital Staff |
| PENDING | CANCELLED | Request Creator |
| PENDING | EXPIRED | System |
| ASSIGNED | ACCEPTED | Ambulance Driver |
| ASSIGNED | REJECTED | Ambulance Driver |
| ASSIGNED | CANCELLED | Request Creator |
| ASSIGNED | EXPIRED | System |
| ACCEPTED | ARRIVING | Ambulance Driver |
| ACCEPTED | CANCELLED | Request Creator / System |
| ARRIVING | PICKED_UP | Ambulance Driver |
| PICKED_UP | DROPPED | Ambulance Driver |
| DROPPED | COMPLETED | System / Ambulance Driver |

### Terminal statuses

- `REJECTED`
- `COMPLETED`
- `CANCELLED`
- `EXPIRED`

### Business rules

1. An ambulance in `ON_DUTY` or `OFFLINE` must not receive a new assignment.
2. Only the assigned driver may update the request journey states.
3. A request should store `accepted_at`, `pickup_at`, and `drop_at` timestamps.
4. On driver rejection, the system should optionally reassign the request to the next nearest available ambulance.
5. If the creator cancels after acceptance, cancellation policy should be logged for audit purposes.

### Suggested socket / notification events

- `ambulance.request.created`
- `ambulance.request.assigned`
- `ambulance.request.accepted`
- `ambulance.request.rejected`
- `ambulance.location.updated`
- `ambulance.request.completed`

---

## 4. Ambulance Status Transition

This status belongs to the **ambulance unit**, not the request.

### Allowed statuses

- `AVAILABLE`
- `ON_DUTY`
- `OFFLINE`
- `MAINTENANCE`

### Default status

- `AVAILABLE`

### Allowed transitions

| Current Status | Next Allowed Status | Triggered By |
|---|---|---|
| AVAILABLE | ON_DUTY | Driver / System |
| AVAILABLE | OFFLINE | Driver |
| AVAILABLE | MAINTENANCE | Hospital Staff |
| ON_DUTY | AVAILABLE | Driver / System |
| ON_DUTY | OFFLINE | Driver |
| OFFLINE | AVAILABLE | Driver |
| OFFLINE | MAINTENANCE | Hospital Staff |
| MAINTENANCE | AVAILABLE | Hospital Staff |

### Business rules

1. Ambulance must be `AVAILABLE` before assignment.
2. Ambulance cannot enter `MAINTENANCE` while an active trip exists.
3. When an ambulance request is accepted, ambulance status should move to `ON_DUTY`.
4. When a trip is completed, ambulance status should return to `AVAILABLE`.

---

## 5. Notification Status

### Allowed statuses

- `UNREAD`
- `READ`
- `ARCHIVED`

### Allowed transitions

| Current Status | Next Allowed Status | Triggered By |
|---|---|---|
| UNREAD | READ | User |
| READ | ARCHIVED | User / System |

### Business rules

1. Notifications are append-only records.
2. Read state should be per recipient.
3. Important operational notifications should also be persisted in audit logs.

---

## 6. Implementation Notes for Backend

### Validation

All state changes should be validated in the service layer, not only in controllers.

### Auditability

Every state transition should record:

- entity id
- old status
- new status
- actor id
- actor role
- timestamp
- optional note / reason

### Concurrency

For request acceptance involving scarce resources such as ICU beds, ventilators, blood units, or ambulance assignment, the backend should use:

- database transactions
- row-level locking where required
- optimistic checks on available counts

### Recommendation

Store status values as enums in PostgreSQL and Prisma to avoid invalid string updates.