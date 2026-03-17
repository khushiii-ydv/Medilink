# MediLink ER Diagram

The following ER diagram represents the relationships between the main
entities in the MediLink healthcare coordination platform.

``` mermaid
erDiagram

HOSPITALS ||--o{ HOSPITAL_RESOURCES : has
HOSPITALS ||--o{ BLOOD_BANK : stores
HOSPITALS ||--o{ DOCTORS : employs
HOSPITALS ||--o{ AMBULANCES : owns

PATIENTS ||--o{ ADMISSION_REQUESTS : creates
HOSPITALS ||--o{ ADMISSION_REQUESTS : receives

HOSPITALS ||--o{ HOSPITAL_REQUESTS : sends
HOSPITALS ||--o{ HOSPITAL_REQUESTS : receives

PATIENTS ||--o{ AMBULANCE_REQUESTS : creates
AMBULANCES ||--o{ AMBULANCE_REQUESTS : fulfills

HOSPITALS {
    int hospital_id PK
    string hospital_name
    string address
    string city
    string state
    string contact_number
    string email
    decimal latitude
    decimal longitude
}

HOSPITAL_RESOURCES {
    int resource_id PK
    int hospital_id FK
    int total_beds
    int available_beds
    int icu_beds
    int ventilators
    int oxygen_supply_level
    timestamp last_updated
}

BLOOD_BANK {
    int blood_id PK
    int hospital_id FK
    string blood_type
    int units_available
    timestamp last_updated
}

DOCTORS {
    int doctor_id PK
    int hospital_id FK
    string doctor_name
    string specialization
    string availability_status
    string contact_number
}

PATIENTS {
    int patient_id PK
    string patient_name
    string phone
    string email
}

ADMISSION_REQUESTS {
    int request_id PK
    int patient_id FK
    int hospital_id FK
    string status
    timestamp request_time
    timestamp response_time
}

HOSPITAL_REQUESTS {
    int request_id PK
    int from_hospital_id FK
    int to_hospital_id FK
    string request_type
    string status
    timestamp created_at
}

AMBULANCES {
    int ambulance_id PK
    int hospital_id FK
    string vehicle_number
    string driver_name
    string driver_contact
    string status
    decimal current_latitude
    decimal current_longitude
}

AMBULANCE_REQUESTS {
    int request_id PK
    int patient_id FK
    int ambulance_id FK
    decimal pickup_latitude
    decimal pickup_longitude
    string status
    timestamp request_time
}
```
