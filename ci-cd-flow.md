# CI/CD Pipeline Flow

![CI/CD Pipeline Flow Diagram](./assets/ci-cd-flow.png)

This diagram illustrates the complete CI/CD pipeline for the Task Management Application. When a developer pushes code to the main branch, GitHub Actions triggers the CI pipeline which runs linting, type checks, tests, and builds Docker images. Upon successful CI completion, the CD pipeline automatically deploys the frontend and backend services to Render Cloud, where they connect to the PostgreSQL database and become accessible to end users.
