# MediLink Backend Implementation Roadmap

## Goal

Build a scalable backend for MediLink using:

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Socket.io

---

## Phase 1 — Project Setup

### Tasks

- initialize Node.js project
- install Express, Prisma, PostgreSQL driver, JWT, bcrypt, Socket.io, zod
- create folder structure
- configure environment variables
- connect PostgreSQL database
- initialize Prisma

### Deliverables

- running Express server
- database connection working
- Prisma schema initialized

---

## Phase 2 — Authentication and RBAC

### Tasks

- create `users` table and role profile tables
- implement register APIs for patient, hospital admin, ambulance driver
- implement login API
- generate JWT token
- write auth middleware
- write role guard middleware

### Deliverables

- secure registration/login
- protected routes by role

---

## Phase 3 — Profile and Dashboard APIs

### Tasks

- patient profile API
- hospital profile API
- ambulance driver profile API
- dashboard summary API for each role

### Deliverables

- each user sees their own top-card information after login

---

## Phase 4 — Hospital Search and Resource APIs

### Tasks

- list hospitals
- filter by beds, ICU, ventilator, oxygen, blood group, specialist
- get hospital resources
- update hospital resources
- update blood bank
- manage specialist list
- manage medical equipment

### Deliverables

- real-time resource-ready search APIs

---

## Phase 5 — Request Management

### Tasks

- patient admission request create/list/cancel
- hospital admission request accept/reject
- hospital-to-hospital request create/list/respond
- ambulance request create/assign/respond/complete
- validate status transitions

### Deliverables

- complete operational request flow

---

## Phase 6 — Real-Time Engine

### Tasks

- integrate Socket.io
- broadcast resource updates
- broadcast ambulance status updates
- broadcast ambulance location updates
- emit request notifications in real time

### Deliverables

- synchronized dashboards across users

---

## Phase 7 — Notifications and Audit Logs

### Tasks

- create notification service
- save notifications in database
- mark as read
- log critical actions in audit table

### Deliverables

- traceable backend actions
- user-facing request alerts

---

## Phase 8 — Validation, Security, Edge Cases

### Tasks

- zod request validation
- centralized error handling
- conflict prevention with transactions
- duplicate request protection
- stale resource checks
- ambulance double-assignment prevention
- rate limiting for auth endpoints

### Deliverables

- robust production-style backend behavior

---

## Recommended Folder Structure

```text
src/
  app.js
  server.js
  config/
    env.js
    prisma.js
    socket.js
  modules/
    auth/
    users/
    hospitals/
    resources/
    blood-bank/
    specialists/
    ambulances/
    requests/
    notifications/
  middleware/
    auth.middleware.js
    role.middleware.js
    validate.middleware.js
    error.middleware.js
  utils/
    api-response.js
    logger.js
    enums.js
```

---

## Immediate Next Coding Order

1. Prisma schema
2. auth routes
3. auth middleware
4. hospital resource routes
5. request routes
6. ambulance routes
7. Socket.io events
8. notifications
9. audit logs

---

## Important Edge Cases to Handle

- invalid JWT token
- hospital trying to edit another hospital's resources
- ambulance driver updating wrong ambulance
- patient accessing another patient's request
- accepting admission when no ICU beds remain
- assigning ambulance that is already on duty
- race condition on high-demand resources
- location update with invalid coordinates
- duplicate hospital transfer request spam

---

## Suggested Environment Variables

```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/medilink
JWT_SECRET=replace_this_with_a_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```