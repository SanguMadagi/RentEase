---
description: Repository Information Overview
alwaysApply: true
---

# Repository Information Overview

## Repository Summary
RentEase is a full-stack application with a Spring Boot backend for API services and a React frontend for user interface, featuring comprehensive session management with 48-hour JWT expiry and inactivity tracking.

## Repository Structure
- **backend/**: Spring Boot Java application with Maven build
- **rentease-frontend/**: React frontend application
- **frontend/**: Additional frontend resources
- **.idea/**: IntelliJ IDEA configuration
- **target/**: Maven build outputs
- **INACTIVITY_AND_SESSION_MANAGEMENT.md**: Session management documentation

### Main Repository Components
- **Backend API**: Handles authentication, MongoDB persistence, Redis caching, Kafka messaging
- **Frontend UI**: React app with Bootstrap, routing, and Leaflet mapping
- **Session Management**: JWT-based auth with inactivity timeouts

## Projects

### Backend
**Configuration File**: backend/pom.xml

#### Language & Runtime
**Language**: Java
**Version**: 17
**Build System**: Maven
**Package Manager**: Maven

#### Dependencies
**Main Dependencies**:
- Spring Boot Starter Web
- Spring Boot Starter WebFlux
- Spring Boot Starter Security
- Spring Boot Starter Data MongoDB
- Spring Boot Starter Mail
- Spring Boot Starter Data Redis
- Spring Kafka
- JJWT API

**Development Dependencies**:
- Lombok

#### Build & Installation
```bash
cd backend
mvn clean install
```

#### Testing
**Framework**: JUnit
**Test Location**: src/test/java/
**Naming Convention**: *Test.java
**Configuration**: Spring Boot Test
**Run Command**:
```bash
cd backend
mvn test
```

### Rentease Frontend
**Configuration File**: rentease-frontend/package.json

#### Language & Runtime
**Language**: JavaScript
**Version**: Node.js
**Build System**: Create React App
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- React 18.2.0
- React DOM 18.2.0
- React Router DOM 6.26.0
- Axios 1.13.2
- Bootstrap 5.3.3
- React Bootstrap 2.10.2
- React Leaflet 4.2.1
- Leaflet 1.9.4

**Development Dependencies**:
- @testing-library/react 16.3.0
- @testing-library/jest-dom 6.9.1
- @testing-library/user-event 13.5.0
- @testing-library/dom 10.4.1
- React Scripts 5.0.1

#### Build & Installation
```bash
cd rentease-frontend
npm install
npm run build
```

#### Testing
**Framework**: Jest
**Test Location**: src/
**Naming Convention**: *.test.js
**Configuration**: react-scripts
**Run Command**:
```bash
cd rentease-frontend
npm test
```