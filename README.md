# Dependency Blast Radius Simulator

## Overview

Dependency Blast Radius Simulator is a full-stack application that helps engineering teams model distributed systems, visualize service dependencies, and simulate cascading failures.

The platform enables teams to understand the impact of service outages and improve system resilience.

---

## Features

### Service Management

* Create and manage services
* Update service information
* Service health dashboard

### Dependency Management

* Create dependencies between services
* Duplicate dependency prevention
* Self-dependency prevention
* Circular dependency detection

### System Visualization

* Interactive dependency graph
* Node and edge visualization using React Flow

### Failure Simulation

* Simulate service failures
* Calculate blast radius
* Identify impacted services
* Impact severity scoring

### Simulation History

* Store previous simulations
* Review historical results

### Search and Filtering

* Search services by name
* Filter services by status

---

## Tech Stack

### Frontend

* React.js
* Next.js
* Tailwind CSS
* Axios
* React Flow

### Backend

* Node.js
* Express.js
* Prisma ORM

### Database

* PostgreSQL (Neon)

---

## Installation

### Clone Repository

```bash
git clone https://github.com/mouneswari123/Dependency-Blast-Radius-Simulator.git
cd Dependency-Blast-Radius-Simulator
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
DATABASE_URL=your_neon_database_url
PORT=5000
```

Run Backend

```bash
npm start
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Application runs at:

Frontend:
http://localhost:3000

Backend:
http://localhost:5000

---

## Project Structure

```text
dependency-blast-radius
├── backend
├── frontend
├── Architecture.md
├── Agent.md
└── README.md
```

---

## Assumptions

* Services are uniquely identified by name.
* A service cannot depend on itself.
* Circular dependencies are not allowed.
* Blast radius calculation uses DFS traversal.

---

## Future Improvements

* Multiple service failure simulation
* Real-time updates using WebSockets
* Redis caching
* Authentication and authorization
* Advanced analytics dashboard
* Risk prediction engine
