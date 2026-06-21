# Dependency Blast Radius Simulator - Architecture

## Overview
Dependency Blast Radius Simulator is a full-stack application designed to model service dependencies in distributed systems and analyze the impact of service failures.

The system allows engineering teams to:

- Create and manage services

- Define service dependencies

- Visualize dependency relationships

- Simulate service failures

- Calculate blast radius

- Store simulation history

- Analyze system resilience
---

# High-Level Architecture

Frontend (Next.js + React)

↓

Axios REST API Calls

↓

Backend (Node.js + Express)

↓

Prisma ORM

↓

PostgreSQL Database



---
# System Components
## Frontend
Technology:

- React.js

- Next.js

- Tailwind CSS

- Axios

- React Flow

Responsibilities:

- Service Management UI

- Dependency Management UI

- Dashboard and Summary Cards

- Blast Radius Simulator

- Dependency Graph Visualization

- Search and Filtering

- Simulation History

- Insights Dashboard

---

## Backend

Technology:

- Node.js

- Express.js

- Prisma ORM



Responsibilities:

- REST API endpoints

- Business logic

- Blast radius calculation

- Circular dependency detection

- Simulation persistence

- Service validation

- Dependency validation

---
## Database
Technology:

- PostgreSQL (Neon)

Main Entities:

### Service
Fields:

- id

- name

- owner

- description

- criticality

- status

- createdAt
---
### Dependency

Fields:

- id

- sourceServiceId

- targetServiceId

- createdAt



Relationship:



Service A

↓

depends on

↓

Service B
---

### Simulation

Fields:

- id

- failedService

- impactedServices

- impactedCount

- severityScore

- createdAt



---
# Component Interactions
1. User creates a service.

2. User creates dependencies between services.

3. Services and dependencies are stored in PostgreSQL.

4. Frontend fetches data using REST APIs.

5. React Flow visualizes the dependency graph.

6. User simulates service failure.

7. Backend calculates blast radius.

8. Impacted services are returned.

9. Simulation history is stored.

10. Dashboard updates automatically.



---
# Blast Radius Algorithm
Approach:

Depth First Search (DFS)
Example:
Frontend

↓

API Gateway

↓

Auth Service

↓

Payment Service
If Frontend fails:
Impacted:

- API Gateway

- Auth Service

- Payment Service

Time Complexity:

O(V + E)

Where:

V = Services

E = Dependencies
Reason:

DFS efficiently traverses dependency graphs and scales well for medium-sized distributed systems.

---------------------------------------------------------------------------------------------------
# Circular Dependency Detection
Example:
Frontend

↓

API Gateway

↓

Auth Service



Invalid Dependency:



Auth Service

↓

Frontend

Solution:

Before creating a dependency, DFS checks whether a path already exists between target and source services.

If a path exists:

- Dependency creation is blocked

- User receives an error message



---



# Design Decisions



## Why React + Next.js?



- Fast development

- Component reusability

- Excellent developer experience

- Easy state management

- Good scalability

---
## Why Node.js + Express?
- Lightweight

- Event-driven architecture

- High performance for I/O operations

- Easy REST API development



---



## Why PostgreSQL?



- Relational structure fits dependency data

- Strong consistency

- Supports complex queries

- Highly reliable
---
## Why Prisma ORM?

- Type-safe database access

- Simplified schema management

- Easy migrations

- Improved developer productivity



---



## Why React Flow?



- Interactive graph visualization

- Node and edge management

- Ideal for dependency mapping

- Excellent developer experience
--------------------------------------------
# Scalability Considerations

Current architecture supports small and medium-sized systems.

Future improvements:

- Redis caching

- Pagination

- WebSockets

- Graph database integration

- Distributed event processing

- Horizontal backend scaling
---

# Failure Handling Strategies

Implemented:

- Form validation

- Duplicate service prevention

- Duplicate dependency prevention

- Self-dependency prevention

- Circular dependency detection

- Error handling using try/catch

- API validation

- Graceful UI fallbacks



---



# Security Considerations



- Input validation

- Controlled API access

- Database query abstraction through Prisma

- Error handling without exposing sensitive information

------------------------------------------------------

# Future Enhancements
- Multiple service failure simulation

- Dependency risk prediction

- Real-time monitoring

- User authentication

- Team management

- Notification system

- Advanced analytics dashboard
---



# Conclusion



The application provides an interactive platform for understanding service dependencies and analyzing cascading failures in distributed systems. The architecture is modular, scalable, and designed to support future enhancements. 
