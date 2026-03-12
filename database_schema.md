# MediLink Database Schema (PostgreSQL)
------------------------------------------------------------------------

# Database Tables

## 1. Hospitals

Stores hospital details.

Fields:

-   hospital_id (PK)
-   hospital_name
-   address
-   city
-   state
-   contact_number
-   email
-   latitude
-   longitude
-   created_at

Purpose: - Hospital registration - Hospital search - Mapping hospital
locations

------------------------------------------------------------------------

## 2. Hospital Resources

Stores real‑time hospital resources.

Fields:

-   resource_id (PK)
-   hospital_id (FK)
-   total_beds
-   available_beds
-   icu_beds
-   ventilators
-   oxygen_supply_level
-   last_updated

Purpose: - Resource availability tracking - Search filtering

------------------------------------------------------------------------

## 3. Blood Bank

Tracks blood availability per hospital.

Fields:

-   blood_id (PK)
-   hospital_id (FK)
-   blood_type
-   units_available
-   last_updated

Purpose: - Blood availability checks - Hospital resource sharing

------------------------------------------------------------------------

## 4. Doctors

Stores hospital doctors and specialists.

Fields:

-   doctor_id (PK)
-   hospital_id (FK)
-   doctor_name
-   specialization
-   availability_status
-   contact_number

Purpose: - Specialist search filter - Doctor availability tracking

------------------------------------------------------------------------

## 5. Patients

Stores patient account information.

Fields:

-   patient_id (PK)
-   patient_name
-   phone
-   email
-   password_hash
-   created_at

Purpose: - Admission requests - Ambulance requests

------------------------------------------------------------------------

## 6. Admission Requests

Handles patient admission workflow.

Fields:

-   request_id (PK)
-   patient_id (FK)
-   hospital_id (FK)
-   status (pending / accepted / rejected)
-   request_time
-   response_time

Purpose: - Patient admission management - Hospital approval workflow

------------------------------------------------------------------------

## 7. Hospital Requests

Handles hospital‑to‑hospital requests.

Fields:

-   request_id (PK)
-   from_hospital_id (FK)
-   to_hospital_id (FK)
-   request_type (transfer / blood / equipment / emergency)
-   description
-   status
-   created_at
-   responded_at

Purpose: - Resource sharing - Patient transfers - Emergency coordination

------------------------------------------------------------------------

## 8. Ambulances

Stores ambulance and driver information.

Fields:

-   ambulance_id (PK)
-   hospital_id (FK)
-   vehicle_number
-   driver_name
-   driver_contact
-   status (available / on_duty / offline)
-   current_latitude
-   current_longitude
-   last_location_update

Purpose: - Ambulance tracking - Emergency dispatch

------------------------------------------------------------------------

## 9. Ambulance Requests

Handles ambulance pickup requests.

Fields:

-   request_id (PK)
-   patient_id (FK)
-   ambulance_id (FK)
-   pickup_latitude
-   pickup_longitude
-   destination_hospital_id
-   status (pending / accepted / rejected / completed)
-   request_time
-   pickup_time
-   drop_time

Purpose: - Emergency transport requests - Ambulance assignment

------------------------------------------------------------------------

# Table Relationships

Main relationships in the database:

-   Hospitals → Hospital Resources
-   Hospitals → Doctors
-   Hospitals → Blood Bank
-   Hospitals → Ambulances
-   Patients → Admission Requests
-   Patients → Ambulance Requests
-   Hospitals → Admission Requests
-   Hospitals → Hospital Requests

------------------------------------------------------------------------

# Total Tables

The system contains **9 core tables**:

1.  hospitals
2.  hospital_resources
3.  blood_bank
4.  doctors
5.  patients
6.  admission_requests
7.  hospital_requests
8.  ambulances
9.  ambulance_requests


