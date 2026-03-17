# API Contract

## Overview

This document describes the **REST API structure** used in the **MediLink Smart Hospital Resource Network**.

The API enables communication between the **frontend dashboards** (Patient, Hospital, Ambulance) and the **backend server**.

The API is organized into the following modules:

* Authentication APIs
* Patient APIs
* Hospital APIs
* Resource APIs
* Blood Bank APIs
* Ambulance APIs
* Request APIs
* Notification APIs

All APIs:

* Use **JSON format**
* Follow **RESTful conventions**
* Require **JWT authentication tokens**

# Base URL

``
/api/v1
``

Example:

``/api/v1/auth/login``



# Authentication System

The system uses **JWT (JSON Web Tokens)** for authentication.

After login:

1. Server generates a **JWT token**
2. Token is returned in the response
3. Frontend stores the token
4. Token is sent in every request header

# Authorization Header

``
Authorization: Bearer <JWT_TOKEN>
``

Example:

``
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
``

# Standard API Response Format

### Success Response

```json
{
  "status": "success",
  "data": {},
  "message": "Request processed successfully"
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Invalid request"
}
```



# 1. Authentication APIs

## Register Patient

### Endpoint

``
POST /api/v1/auth/register/patient
``

### Request Body

```json
{
  "name": "Rahul Sharma",
  "phone_number": "9876543210",
  "password": "password123"
}
```

### Response

```json
{
  "status": "success",
  "message": "Patient registered successfully"
}
```


## Login

### Endpoint

``
POST /api/v1/auth/login
``

### Request Body

```json
{
  "phone_number": "9876543210",
  "password": "password123"
}
```

### Response

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "user_id": "uuid",
      "role": "patient"
    }
  }
}
```


## Logout

### Endpoint

``POST /api/v1/auth/logout``

### Headers

``
Authorization: Bearer <TOKEN>
``

### Response

```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```


# 2. Patient APIs

## Get Patient Profile

### Endpoint

``
GET /api/v1/patients/profile
``

### Response

```json
{
  "status": "success",
  "data": {
    "patient_id": "uuid",
    "name": "Rahul Sharma",
    "phone_number": "9876543210"
  }
}
```


## Search Hospitals

Allows patients to search hospitals based on resource availability.

### Endpoint

``
GET /api/v1/hospitals
``

### Response

```json
{
  "status": "success",
  "data": [
    {
      "hospital_id": "uuid",
      "name": "City Care Hospital",
      "available_beds": 12,
      "available_icu_beds": 4
    }
  ]
}
```


# 3. Hospital APIs

## Get Hospital Profile

### Endpoint

``
GET /api/v1/hospitals/{hospital_id}
``

### Response

```json
{
  "status": "success",
  "data": {
    "hospital_id": "uuid",
    "name": "City Care Hospital",
    "address": "Pune, Maharashtra",
    "contact_number": "9876543210"
  }
}
```


## Get Hospital Requests

### Endpoint

``
GET /api/v1/hospitals/{hospital_id}/requests
``

### Response

```json
{
  "status": "success",
  "data": [
    {
      "request_id": "uuid",
      "request_type": "admission",
      "status": "PENDING"
    }
  ]
}
```


# 4. Resource APIs

## Get Hospital Resources

### Endpoint

``
GET /api/v1/hospitals/{hospital_id}/resources
``

### Response

```json
{
  "status": "success",
  "data": {
    "available_beds": 12,
    "available_icu_beds": 4,
    "available_ventilators": 3,
    "oxygen_units_available": 20
  }
}
```



## Update Hospital Resources

### Endpoint

``
PUT /api/v1/hospitals/{hospital_id}/resources
``

### Request Body

```json
{
  "available_beds": 10,
  "available_icu_beds": 3,
  "available_ventilators": 2,
  "oxygen_units_available": 15
}
```

### Response

```json
{
  "status": "success",
  "message": "Resources updated successfully"
}
```


# 5. Blood Bank APIs

## Get Blood Availability

### Endpoint

``
GET /api/v1/hospitals/{hospital_id}/blood-bank
``

### Response

```json
{
  "status": "success",
  "data": [
    {
      "blood_group": "A+",
      "units_available": 5
    },
    {
      "blood_group": "O-",
      "units_available": 2
    }
  ]
}
```


## Update Blood Availability

### Endpoint

``
PUT /api/v1/hospitals/{hospital_id}/blood-bank
``

### Request Body

```json
{
  "blood_group": "A+",
  "units_available": 8
}
```


# 6. Ambulance APIs

## Get Available Ambulances

### Endpoint

``
GET /api/v1/ambulances
``

### Response

```json
{
  "status": "success",
  "data": [
    {
      "ambulance_id": "uuid",
      "driver_name": "Amit Singh",
      "status": "AVAILABLE"
    }
  ]
}
```


## Update Ambulance Status

### Endpoint

``
PUT /api/v1/ambulances/{ambulance_id}/status
``

### Request

```json
{
  "status": "ON_DUTY"
}
```


## Update Ambulance Location

### Endpoint

``
POST /api/v1/ambulances/{ambulance_id}/location
``

### Request

```json
{
  "latitude": 18.5204,
  "longitude": 73.8567
}
```


# 7. Request APIs

## Create Request

Used by patients to create admission or ambulance requests.

### Endpoint

``
POST /api/v1/requests
``

### Request Body

```json
{
  "request_type": "admission",
  "hospital_id": "uuid",
  "description": "Need ICU bed urgently"
}
```

### Response

```json
{
  "status": "success",
  "message": "Request created",
  "data": {
    "request_id": "uuid",
    "status": "PENDING"
  }
}
```


## Get My Requests

### Endpoint

``
GET /api/v1/requests/my
``

### Response

```json
{
  "status": "success",
  "data": [
    {
      "request_id": "uuid",
      "request_type": "ambulance",
      "status": "ACCEPTED"
    }
  ]
}
```

## Update Request Status

### Endpoint

``
PATCH /api/v1/requests/{request_id}/status
``

### Request

```json
{
  "status": "ACCEPTED"
}
```


# 8. Notification APIs

## Get Notifications

### Endpoint

``
GET /api/v1/notifications
``

### Response

```json
{
  "status": "success",
  "data": [
    {
      "notification_id": "uuid",
      "message": "Your admission request has been accepted"
    }
  ]
}
```


## Mark Notification as Read

### Endpoint

``
PATCH /api/v1/notifications/{notification_id}/read
``

### Response

```json
{
  "status": "success",
  "message": "Notification marked as read"
}
```


# API Error Codes

| Code | Name | Description |
|------|------|-------------|
| 200 | OK | Request processed successfully |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | User does not have permission |
| 404 | Not Found | Requested resource does not exist |
| 409 | Conflict | Resource already exists |
| 422 | Validation Error | Invalid or incomplete input data |
| 500 | Internal Server Error | Unexpected server failure |

### Example Error Response

```json
{
  "status": "error",
  "code": 401,
  "message": "Authentication token missing or invalid"
}
```


# Security Rules

1. All APIs except **login and registration** require authentication.
2. JWT tokens must be included in the **Authorization header**.
3. Patients can only access **their own requests**.
4. Hospital staff can only manage **their hospital’s resources**.
5. Ambulance drivers can only update **their assigned ambulance status and location**.
6. Role-based permissions are enforced for all protected routes.
7. All critical actions such as **resource updates and request status changes are logged**.


