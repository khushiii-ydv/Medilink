# MediLink – Smart Hospital Resource Network

A web-based platform for coordinating **hospital resources, ambulance services, and patient requests** in real time.

The system allows **patients to find hospitals and request medical services**, while **hospitals manage resources and respond to requests efficiently**. Ambulance drivers can receive emergency requests and share live location updates.

MediLink helps reduce delays in emergency care by providing **real-time visibility of hospital resources and ambulance availability**.

# Documentation

Project documentation is organized inside the `docs` directory.

| Document | Description |
|---------|-------------|
| [Workflow](docs/workflow.md) | Detailed workflow for patients, hospitals, and ambulance services |
| [Role Permissions](docs/role_permissions.md) | Role-based access control definitions |
| [ER Diagram](docs/er_diagram.md) | Entity relationship diagram of the database |
| [Database Schema](docs/database_schema.md) | Database tables and relationships |
| [API Contract](docs/api_contract.md) | Complete REST API specification |
| [System Architecture](docs/system_architecture.md) | Overall system architecture and components |

# Project Structure

```
medilink
│
├── frontend/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   │   ├── login/
│   │   ├── patient-dashboard/
│   │   ├── hospital-dashboard/
│   │   └── ambulance-dashboard/
│   └── index.html
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── models/
│   └── server.js
│
├── docs/
│   ├── workflow.md
│   ├── role-permissions.md
│   ├── er-diagram.md
│   ├── database-schema.md
│   ├── api-contract.md
│   └── system-architecture.md
│
└── README.md
```

