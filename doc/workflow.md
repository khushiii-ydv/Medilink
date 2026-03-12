# MediLink – Smart Hospital Resource Network

# System Workflow

## 1. System Overview

MediLink is a **real-time healthcare coordination platform** connecting **hospitals, ambulance services, and patients** through a centralized network.

The platform helps users:

- View real-time hospital resources
- Request hospital admission
- Request ambulances
- Coordinate patient transfers
- Track emergency resources

All users access the system through **role-based dashboards** after authentication.

# 2. User Authentication Workflow

## 2.1 Registration

Users register based on their role.

### Hospital Registration

Required information:

- Hospital Name
- Admin Username
- Password
- Address
- Contact Number
- Location (Google Maps coordinates)

### Ambulance Registration

Required information:

- Driver Name
- Phone Number
- Ambulance Number
- Associated Hospital

### Patient Registration

Required information:

- Name
- Phone Number
- Password

## 2.2 Login Workflow

```
User → Login Page → Enter Credentials → Backend Authentication (JWT) → Role Verification → Redirect to Dashboard
```

Possible outcomes:

- Successful login → Dashboard
- Invalid credentials → Error message

# 3. Hospital Dashboard Workflow

Hospitals manage **resources, patient requests, hospital transfers, and ambulances**.

## 3.1 Resource Management Workflow

Hospitals update real-time hospital resources.

Resources include:

- Total beds
- ICU beds
- Ventilators
- Oxygen supply
- Blood bank availability (by blood type)
- Medical equipment
- Specialist doctors

### Workflow

```
Hospital Login
   ↓
Open Resource Management
   ↓
Update Resource Data
   ↓
Backend API Update
   ↓
Database Updated
   ↓
Socket.io Broadcast
   ↓
All dashboards updated in real-time
```

## 3.2 Hospital-to-Hospital Request Workflow

Hospitals can send requests to other hospitals for:

- Patient transfers
- Blood bank support
- Equipment requests
- Emergency resource sharing

### Example

Hospital A has no ICU beds available.

### Workflow

```
Hospital A
   ↓
Search Hospitals with Available ICU Beds
   ↓
Select Hospital B
   ↓
Send Transfer Request
   ↓
Request Stored in Database
   ↓
Hospital B Receives Notification
```

### Hospital B Response Options

- Accept transfer
- Reject transfer
- Suggest another hospital

## 3.3 Patient Request Workflow

Patients can send admission requests to hospitals.

### Workflow

```
Patient
   ↓
Select Hospital
   ↓
Click "Request Admission"
   ↓
Backend Stores Request
   ↓
Hospital Receives Notification
   ↓
Hospital Accepts / Rejects
   ↓
Patient Receives Response
```

## 3.4 Ambulance Management Workflow

Hospitals manage ambulances linked to them.

### Hospital can:

- View registered ambulances
- Track ambulance location
- Assign ambulances to requests
- Monitor status

### Workflow

```
Hospital Dashboard
   ↓
Open Ambulance Management
   ↓
View Ambulance List
   ↓
Check Status (Available / Busy)
   ↓
Assign Ambulance to Emergency
```

# 4. Ambulance Dashboard Workflow

Ambulance drivers manage **availability and emergency pickup requests**.

## 4.1 Ambulance Availability Workflow

```
Driver Login
   ↓
System Loads Ambulance Profile
   ↓
Status = Available
   ↓
Visible Across MediLink Network
```

Drivers can change status to:

- Available
- On Duty
- Offline

## 4.2 GPS Tracking Workflow

Ambulance location is updated in real-time.

```
Driver Device
   ↓
GPS Coordinates Captured
   ↓
Location Sent to Backend
   ↓
Database Updated
   ↓
Displayed on Map
```

This allows hospitals and patients to track ambulances live.

## 4.3 Emergency Pickup Workflow

Emergency requests can be created by:

- Patients
- Hospitals

### Workflow

```
Emergency Request Created
   ↓
System Identifies Nearest Ambulances
   ↓
Request Sent to Drivers
   ↓
Driver Accepts / Rejects Request
```

If accepted:

```
Driver Accept Request
   ↓
Status Changes to "On Duty"
   ↓
Navigation to Pickup Location
   ↓
Live Tracking Enabled
```

# 5. Patient Dashboard Workflow

Patients can search hospitals, request admission, and request ambulances.

## 5.1 Search Hospitals Workflow

Patients search hospitals using filters.

### Filters include

- Beds available
- ICU beds
- Ventilators
- Oxygen supply
- Blood bank availability
- Specialist doctors

### Workflow

```
Patient Opens Search
   ↓
Apply Filters
   ↓
Backend Query
   ↓
Matching Hospitals Returned
```

Displayed information:

- Hospital name
- Address
- Contact details
- Resource availability
- Google Maps location

## 5.2 Admission Request Workflow

```
Patient
   ↓
Select Hospital
   ↓
Click "Request Admission"
   ↓
Request Stored in Backend
   ↓
Hospital Dashboard Notification
   ↓
Hospital Accepts / Rejects
   ↓
Patient Receives Response
```

## 5.3 Ambulance Request Workflow

Patients can request nearby ambulances.

### Workflow

```
Patient Clicks "Request Ambulance"
   ↓
System Finds Nearby Ambulances
   ↓
List Displayed
   ↓
Patient Selects Ambulance
   ↓
Driver Receives Request
   ↓
Driver Accepts / Rejects
```

Displayed ambulance information:

- Ambulance number
- Driver contact
- Distance
- Estimated arrival time
- Live location

# 6. Real-Time Data Flow

Real-time updates are powered by **Socket.io**.

Events include:

- Resource updates
- Ambulance status updates
- Emergency requests
- Transfer requests
- GPS location updates

### Data Flow

```
User Action
   ↓
Backend API
   ↓
Database Update
   ↓
Socket Event Triggered
   ↓
All Connected Dashboards Updated
```

# 7. Notification Workflow

Notifications are generated for:

- Admission requests
- Transfer requests
- Ambulance requests
- Resource alerts

### Workflow

```
Event Occurs
   ↓
Notification Service Triggered
   ↓
Push Notification Sent
   ↓
User Takes Action
```

# 8. Error Handling Workflow

Possible system issues:

- Hospital resource conflict
- Ambulance unavailable
- Request timeout
- GPS tracking failure

### System Response

- Display error message
- Suggest alternative hospitals
- Retry request
- Log system errors

