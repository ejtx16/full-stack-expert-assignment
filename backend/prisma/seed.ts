import { PrismaClient, TaskStatus, TaskPriority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const hashedPassword = await bcrypt.hash('Password123', 12);

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  console.log(`Created demo user: ${demoUser.email}`);

  // Create sample tasks
  const tasks = [
    {
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the task management application including API docs, setup guide, and architecture overview.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      userId: demoUser.id,
    },
    {
      title: 'Implement user authentication',
      description: 'Set up JWT-based authentication with login, register, and token refresh functionality.',
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      userId: demoUser.id,
    },
    {
      title: 'Design database schema',
      description: 'Create Prisma schema for users and tasks with proper relationships and indexes.',
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      userId: demoUser.id,
    },
    {
      title: 'Build task CRUD API',
      description: 'Implement REST API endpoints for creating, reading, updating, and deleting tasks.',
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      userId: demoUser.id,
    },
    {
      title: 'Create React frontend',
      description: 'Build the frontend application using React, TypeScript, and Tailwind CSS.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      userId: demoUser.id,
    },
    {
      title: 'Set up Docker containers',
      description: 'Create Dockerfiles for frontend and backend, and configure docker-compose for development and production.',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      userId: demoUser.id,
    },
    {
      title: 'Configure CI/CD pipeline',
      description: 'Set up GitHub Actions workflow for automated testing, building, and deployment.',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
      userId: demoUser.id,
    },
    {
      title: 'Write unit tests',
      description: 'Add comprehensive unit tests for backend services and frontend components.',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      userId: demoUser.id,
    },
    {
      title: 'Optimize database queries',
      description: 'Review and optimize database queries for better performance.',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      dueDate: null,
      userId: demoUser.id,
    },
    {
      title: 'Add task filtering and sorting',
      description: 'Implement filtering by status, priority, and due date. Add sorting options.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      userId: demoUser.id,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }

  console.log(`Created ${tasks.length} sample tasks`);

  // Create second user for testing
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    },
  });

  console.log(`Created test user: ${testUser.email}`);

  // Create a task for test user
  await prisma.task.create({
    data: {
      title: 'Test User Task',
      description: 'This task belongs to the test user.',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      userId: testUser.id,
    },
  });

  console.log('Database seed completed successfully!');
  console.log('\nDemo credentials:');
  console.log('  Email: demo@example.com');
  console.log('  Password: Password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

