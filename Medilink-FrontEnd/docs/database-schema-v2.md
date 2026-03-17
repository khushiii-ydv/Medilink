# MediLink Database Schema v2

## Overview

This version improves the original schema for better:

- scalability
- authentication design
- role-based authorization
- auditability
- real-time operations
- future expansion

The biggest improvement is introducing a **central users table** and separating authentication from role-specific profile data.

---

## Core Design Principles

1. Authentication should be centralized.
2. Each person or organization logging in should have one account in `users`.
3. Role-specific information should live in profile tables.
4. Mutable operational data such as resources, requests, locations, and notifications should be normalized.
5. Statuses should use enums.
6. Critical updates should support transactions and audit logs.

---

## 1. Users

Stores login identity for all actors.

Fields:

- `id` (PK, UUID)
- `role` (`PATIENT`, `HOSPITAL_ADMIN`, `AMBULANCE_DRIVER`)
- `phone_number` (unique, nullable)
- `email` (unique, nullable)
- `password_hash`
- `is_active`
- `last_login_at`
- `created_at`
- `updated_at`

Purpose:

- central authentication
- JWT subject mapping
- role-based access control

---

## 2. Hospitals

Stores hospital organization data.

Fields:

- `id` (PK, UUID)
- `name`
- `address`
- `city`
- `state`
- `contact_number`
- `email`
- `latitude`
- `longitude`
- `created_at`
- `updated_at`

Purpose:

- hospital listing
- hospital search
- resource ownership

---

## 3. Hospital Admin Profiles

Maps a login account to a hospital.

Fields:

- `id` (PK, UUID)
- `user_id` (FK → users.id, unique)
- `hospital_id` (FK → hospitals.id)
- `full_name`
- `designation`
- `created_at`

Purpose:

- allows multiple hospital staff accounts per hospital
- keeps auth separate from hospital organization data

---

## 4. Patient Profiles

Fields:

- `id` (PK, UUID)
- `user_id` (FK → users.id, unique)
- `full_name`
- `phone_number`
- `email`
- `gender` (nullable)
- `date_of_birth` (nullable)
- `created_at`
- `updated_at`

Purpose:

- patient dashboard identity
- request ownership

---

## 5. Ambulances

Stores ambulance units.

Fields:

- `id` (PK, UUID)
- `hospital_id` (FK → hospitals.id)
- `vehicle_number` (unique)
- `status` (`AVAILABLE`, `ON_DUTY`, `OFFLINE`, `MAINTENANCE`)
- `created_at`
- `updated_at`

Purpose:

- fleet management
- dispatching
- assignment control

---

## 6. Ambulance Driver Profiles

Maps driver login to ambulance.

Fields:

- `id` (PK, UUID)
- `user_id` (FK → users.id, unique)
- `ambulance_id` (FK → ambulances.id, unique)
- `driver_name`
- `driver_phone`
- `license_number` (nullable)
- `created_at`
- `updated_at`

Purpose:

- one authenticated driver per ambulance unit
- driver dashboard identity

---

## 7. Hospital Resources

Stores real-time hospital capacity snapshot.

Fields:

- `id` (PK, UUID)
- `hospital_id` (FK → hospitals.id, unique)
- `total_beds`
- `available_beds`
- `total_icu_beds`
- `available_icu_beds`
- `total_ventilators`
- `available_ventilators`
- `oxygen_units_available`
- `last_updated`
- `updated_by_user_id` (FK → users.id, nullable)

Purpose:

- real-time resource tracking
- search filtering
- audit support

---

## 8. Blood Bank Inventory

Fields:

- `id` (PK, UUID)
- `hospital_id` (FK → hospitals.id)
- `blood_group`
- `units_available`
- `last_updated`

Constraints:

- unique (`hospital_id`, `blood_group`)

Purpose:

- blood search
- inter-hospital support

---

## 9. Specialists

Fields:

- `id` (PK, UUID)
- `hospital_id` (FK → hospitals.id)
- `doctor_name`
- `specialization`
- `availability_status` (`AVAILABLE`, `BUSY`, `OFF_DUTY`)
- `contact_number` (nullable)
- `updated_at`

Purpose:

- specialist search filter
- doctor availability visibility

---

## 10. Medical Equipment Inventory

Fields:

- `id` (PK, UUID)
- `hospital_id` (FK → hospitals.id)
- `equipment_name`
- `total_quantity`
- `available_quantity`
- `last_updated`

Constraints:

- unique (`hospital_id`, `equipment_name`)

Purpose:

- equipment sharing
- search and transfer support

---

## 11. Admission Requests

Fields:

- `id` (PK, UUID)
- `patient_id` (FK → patient_profiles.id)
- `hospital_id` (FK → hospitals.id)
- `description`
- `status` (`PENDING`, `UNDER_REVIEW`, `ACCEPTED`, `REJECTED`, `CANCELLED`, `EXPIRED`)
- `rejection_reason` (nullable)
- `requested_at`
- `responded_at` (nullable)
- `cancelled_at` (nullable)
- `expires_at` (nullable)

Purpose:

- patient admission workflow

---

## 12. Hospital Requests

Fields:

- `id` (PK, UUID)
- `from_hospital_id` (FK → hospitals.id)
- `to_hospital_id` (FK → hospitals.id)
- `request_type` (`TRANSFER`, `BLOOD`, `EQUIPMENT`, `EMERGENCY`)
- `description`
- `status` (`PENDING`, `VIEWED`, `ACCEPTED`, `REJECTED`, `FULFILLED`, `CANCELLED`, `EXPIRED`)
- `requested_at`
- `responded_at` (nullable)
- `fulfilled_at` (nullable)
- `cancelled_at` (nullable)

Purpose:

- inter-hospital coordination

---

## 13. Ambulance Requests

Fields:

- `id` (PK, UUID)
- `created_by_role` (`PATIENT`, `HOSPITAL_ADMIN`)
- `patient_id` (FK → patient_profiles.id, nullable)
- `hospital_id` (FK → hospitals.id, nullable)
- `ambulance_id` (FK → ambulances.id, nullable)
- `pickup_latitude`
- `pickup_longitude`
- `destination_hospital_id` (FK → hospitals.id, nullable)
- `status` (`PENDING`, `ASSIGNED`, `ACCEPTED`, `REJECTED`, `ARRIVING`, `PICKED_UP`, `DROPPED`, `COMPLETED`, `CANCELLED`, `EXPIRED`)
- `requested_at`
- `accepted_at` (nullable)
- `pickup_at` (nullable)
- `drop_at` (nullable)
- `cancelled_at` (nullable)

Purpose:

- emergency transport workflow

---

## 14. Ambulance Location Logs

Fields:

- `id` (PK, UUID)
- `ambulance_id` (FK → ambulances.id)
- `latitude`
- `longitude`
- `recorded_at`

Purpose:

- GPS history
- debugging trip tracking
- fallback if live socket state is lost

---

## 15. Notifications

Fields:

- `id` (PK, UUID)
- `recipient_user_id` (FK → users.id)
- `type`
- `title`
- `message`
- `is_read`
- `created_at`
- `read_at` (nullable)
- `metadata` (JSONB, nullable)

Purpose:

- user-facing alerts
- request updates
n
---

## 16. Audit Logs

Fields:

- `id` (PK, UUID)
- `actor_user_id` (FK → users.id, nullable)
- `entity_type`
- `entity_id`
- `action`
- `old_value` (JSONB, nullable)
- `new_value` (JSONB, nullable)
- `ip_address` (nullable)
- `created_at`

Purpose:

- traceability
- security logging
- compliance-friendly history

---

## Recommended Relationships

- `users` → one-to-one → `patient_profiles`
- `users` → one-to-one → `hospital_admin_profiles`
- `users` → one-to-one → `ambulance_driver_profiles`
- `hospitals` → one-to-many → `ambulances`
- `hospitals` → one-to-one → `hospital_resources`
- `hospitals` → one-to-many → `blood_bank_inventory`
- `hospitals` → one-to-many → `specialists`
- `hospitals` → one-to-many → `medical_equipment_inventory`
- `ambulances` → one-to-many → `ambulance_location_logs`

---

## Why this schema is better than v1

1. It supports **single auth + multiple roles** cleanly.
2. It keeps login logic separate from domain data.
3. It makes **RBAC middleware** simpler.
4. It supports **multiple hospital staff accounts**.
5. It supports better **audit logs** and **real-time sync fallback**.
6. It gives room for future modules without redesigning auth.