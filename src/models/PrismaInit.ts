import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function initializeGlobalStatuses() {
  const defaultTaskStatuses = [
    "Product backlog",
    "Sprint backlog",
    "To Do",
    "On Work",
    "Review",
    "Testing",
    "finished",
  ];
  const taskStatusCount = await prisma.taskStatus.count();

  if (taskStatusCount === 0) {
    for (const status of defaultTaskStatuses) {
      await prisma.taskStatus.create({
        data: {
          name: status,
        },
      });
    }
  }
}

async function initializeProjectStatuses() {
  const defaultProjectStatuses = [
    "initiated",
    "in progress",
    "completed",
    "on hold",
    "cancelled",
  ];
  const projectStatusCount = await prisma.projectStatus.count();

  if (projectStatusCount === 0) {
    for (const status of defaultProjectStatuses) {
      await prisma.projectStatus.create({
        data: {
          name: status,
        },
      });
    }
  }
}

async function initializeUserSkills() {
  const defaultSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C#",
    "SQL",
    "NoSQL",
    "DevOps",
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
  ];
  const skillCount = await prisma.skill.count();

  if (skillCount === 0) {
    for (const skill of defaultSkills) {
      await prisma.skill.create({
        data: {
          name: skill,
        },
      });
    }
  }
}

async function initializeDatabase() {
  try {
    await Promise.all([
      initializeGlobalStatuses(),
      initializeProjectStatuses(),
      initializeUserSkills(),
    ]);
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Call this function on application startup
initializeDatabase();

export default prisma;
