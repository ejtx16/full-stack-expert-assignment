## Assumptions & Decisions

### Technical Decisions

1. **PostgreSQL over MongoDB**: Structured data with relationships benefits from relational DB
2. **Prisma over Sequelize**: Better TypeScript support, cleaner API
3. **React Query over Redux**: Better suited for server state management
4. **Vite over CRA**: Faster builds, better DX
5. **Zod for validation**: Shared schemas between frontend and backend

### Business Assumptions

1. Single user per account (no team/organization features)
2. Tasks are private to each user
3. No real-time collaboration needed
4. English-only interface (no i18n)
5. No file attachments on tasks
