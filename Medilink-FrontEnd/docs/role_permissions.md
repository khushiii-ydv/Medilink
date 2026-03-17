# Role Permissions

## Overview

The system uses **Role-Based Access Control (RBAC)** to manage permissions for different types of users.
Each role has a defined set of actions they are allowed to perform within the MediLink platform.

Currently, the platform supports three roles:

1. **Patient**
2. **Hospital Staff**
3. **Ambulance Driver**

Permissions ensure that users can only access features relevant to their responsibilities.


## Permission Matrix

| Action | Patient | Hospital Staff | Ambulance Driver |
|------|--------|---------------|----------------|
| Login | ✔ | ✔ | ✔ |
| Access Dashboard | ✔ | ✔ | ✔ |
| Search Hospitals | ✔ | ✖ | ✖ |
| View Hospital Resources | ✔ | ✔ | ✖ |
| Request Hospital Admission | ✔ | ✖ | ✖ |
| Receive Admission Requests | ✖ | ✔ | ✖ |
| Accept / Reject Admission Requests | ✖ | ✔ | ✖ |
| Update Hospital Resources | ✖ | ✔ | ✖ |
| Manage Blood Bank Data | ✖ | ✔ | ✖ |
| Manage Ambulance List | ✖ | ✔ | ✖ |
| View Ambulance Locations | ✔ | ✔ | ✔ |
| Request Ambulance | ✔ | ✖ | ✖ |
| Receive Ambulance Requests | ✖ | ✖ | ✔ |
| Accept / Reject Ambulance Requests | ✖ | ✖ | ✔ |
| Update Ambulance Status | ✖ | ✖ | ✔ |
| Share GPS Location | ✖ | ✖ | ✔ |
| Send Hospital Transfer Request | ✖ | ✔ | ✖ |
| Receive Notifications | ✔ | ✔ | ✔ |



## Security Rules

1. Each user can access **only the resources permitted by their role**.
2. Patients can only view **their own requests and request status**.
3. Hospital staff can only manage **resources belonging to their hospital**.
4. Ambulance drivers can only access **their assigned ambulance and pickup requests**.
5. Sensitive operations such as **resource updates and request approvals require authentication and role verification**.
6. All protected API routes enforce **JWT authentication and role validation**.
7. Unauthorized actions are **blocked by the backend permission system**.
   

