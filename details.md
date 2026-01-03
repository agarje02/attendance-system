
## 1. Product Overview: "EduNode"

**EduNode** is a hierarchical educational management platform that allows administrators (Owners) to build digital structures for schools, manage departments, and facilitate live classroom sessions with immutable records.

### Core Value Proposition

* **Flexibility:** Create a full school hierarchy or standalone independent classes.
* **Managed Identity:** Owners create and control student/teacher accounts.
* **Live Session Integrity:** "Scheduled Classes" capture real-time attendance and summaries that become permanent records once ended.

---

## 2. User Roles & Permissions

| Role | Description | Key Permissions |
| --- | --- | --- |
| **Owner** | The primary account holder (The Administrator). | Create Schools/Departments, create Teacher/Student accounts, manage all billing. |
| **Teacher** | Managed account created by Owner. | Manage assigned classes, start/end live sessions, add resources, approve student requests. |
| **Student** | Managed account created by Owner. | Apply to classes/departments, attend live sessions, view resources. |

---

## 3. Detailed Product Workflow

### A. The Hierarchy Logic

1. **Level 1: School** (Optional) - The top-level container.
2. **Level 2: Department** (Optional) - Groups related classes (e.g., Science Dept).
3. **Level 3: Class** - The functional unit where learning happens.
* *Note:* A user can create a Class directly without needing a School or Department.



### B. The Managed User System

Unlike social platforms, the **Owner** generates the sub-accounts.

* Owner fills a form: `[Username, Password, Role, Assigned Department/Class]`.
* This ensures the Owner retains full control over the academic data and user access.

### C. The "Live Class" Lifecycle

1. **Creation:** A Teacher schedules a session within a Class.
2. **Active (In-Memory):** While the class is live, data (like temporary chat or active attendance) is held in a fast-access state (e.g., Redis).
3. **The Session:** Teacher marks attendance (Present/Absent) and teaches the material.
4. **Finalization:** Teacher adds a "Session Summary."
5. **Persistence:** Once the "End Class" button is clicked, the session moves to the Database as an **Immutable Record**. No one—not even the teacher—can edit it after this point.

---

## 4. Database Schema (PostgreSQL/SQL)

### 4.1 Users & Identity

```sql
-- The main account who signs up
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE,
    password_hash TEXT,
    full_name VARCHAR,
    created_at TIMESTAMP
);

-- Sub-accounts (Teachers/Students) managed by the Owner
CREATE TABLE managed_users (
    id UUID PRIMARY KEY,
    owner_id UUID REFERENCES users(id),
    username VARCHAR UNIQUE,
    password_hash TEXT,
    role ENUM('teacher', 'student'),
    department_id UUID NULL, -- Optional link
    created_at TIMESTAMP
);

```

### 4.2 Structure

```sql
CREATE TABLE schools (
    id UUID PRIMARY KEY,
    owner_id UUID REFERENCES users(id),
    name VARCHAR
);

CREATE TABLE departments (
    id UUID PRIMARY KEY,
    school_id UUID REFERENCES schools(id),
    name VARCHAR
);

CREATE TABLE classes (
    id UUID PRIMARY KEY,
    owner_id UUID REFERENCES users(id),
    department_id UUID NULL, -- Can be null for standalone classes
    class_name VARCHAR,
    description TEXT,
    resources JSONB -- For links and documents
);

```

### 4.3 Relationships & Sessions

```sql
-- Linking Users to Classes
CREATE TABLE class_members (
    class_id UUID REFERENCES classes(id),
    user_id UUID REFERENCES managed_users(id),
    role ENUM('teacher', 'student'),
    status ENUM('pending', 'approved') -- For the request/accept flow
);

-- The "Scheduled Class" Entity (Live Sessions)
CREATE TABLE class_sessions (
    id UUID PRIMARY KEY,
    class_id UUID REFERENCES classes(id),
    teacher_id UUID REFERENCES managed_users(id),
    scheduled_time TIMESTAMP,
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    summary TEXT, -- Added at the end
    attendance JSONB, -- Map of StudentID: Status
    is_finalized BOOLEAN DEFAULT FALSE -- Becomes TRUE when ended
);

```

---

## 5. Missing Elements Added (Recommended)

1. **Request Notifications:** A dashboard notification for Teachers when a Student "Applies" to their class.
2. **Resource Library:** A dedicated section within each Class for Teachers to upload PDFs or YouTube links.
3. **Student Progress View:** A page for Students to see their attendance history across all sessions (read-only).
4. **Audit Logs:** A log for the Owner to see when Teachers start/end classes to ensure accountability.
5. **Session Dashboard:** A "Live" view for the Teacher showing a timer and a list of students with toggle switches for attendance.

---
