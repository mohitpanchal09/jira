Thanks! Here's your updated and accurate `README.md` file with the specified tech stack:

---

````markdown
# 🛠️ Jira Clone – Fullstack Task & Project Management Tool

A **Jira-inspired project management app** where you can create **Workspaces**, manage **Projects**, and organize **Tasks** with powerful features like **analytics**, **member collaboration**, and **multi-view task boards** (Table, Kanban, Calendar). This is a fullstack application built with **Next.js**, **NeonTech’s Postgres**, and **AWS S3** for image handling.

![Dashboard Screenshot](./screenshot.png) <!-- Replace with your actual image path -->

## 🚀 Features

### ✅ Workspace Management
- Create and switch between multiple workspaces
- Organize projects within workspaces

### 📁 Project Management
- Create, update, and delete projects
- Add tasks and manage progress under each project

### 🧩 Task Management
- Create tasks with title, description, status, due date, and assignee
- Full CRUD support for tasks
- Tasks displayed in:
  - **Table View** for detailed inspection
  - **Kanban View** for drag-and-drop workflow
  - **Calendar View** for date-based scheduling

### 📊 Project Analytics
- Get insights like:
  - Total Tasks
  - Assigned Tasks
  - Completed Tasks
  - Incomplete & Overdue Tasks

### 👥 Team Collaboration
- Invite members to workspaces via **invite links**
- Assign tasks to specific members
- Real-time updates and status tracking

### 🔧 Complete CRUD Operations
- For Workspaces, Projects, Tasks, and Members

## 🛠️ Tech Stack

| Layer        | Tech                                 |
|--------------|--------------------------------------|
| **Frontend** | Next.js 14 + TypeScript              |
| **Backend**  | Next.js App Router (Fullstack)       |
| **Database** | NeonTech’s Postgres (Serverless SQL) |
| **Storage**  | AWS S3 (for image uploads)           |
| **Auth**     | NextAuth                             |
| **Styling**  | Tailwind CSS                         |
| **State**    | Zustand / Context API (if used)      |

## 🖼️ Screenshots

- Home Dashboard with Analytics
- Task Table View
- Kanban Board View
- Calendar Task View
- Member Invitation Flow

> Add relevant screenshots in your repository.

## 📦 Getting Started

```bash
git clone https://github.com/your-username/jira-clone.git
cd jira-clone
npm install
npm run dev
````

### 🔐 Environment Variables

Make sure to add the following to your `.env.local` file:

```env
DATABASE_URL=your_neon_postgres_url
NEXTAUTH_SECRET = next_auth_secret
NEXTAUTH_URL=http://localhost:3000
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET_NAME=your_bucket_name
```

## 🔮 Future Enhancements

* Role-based access control
* Real-time notifications
* Mobile responsiveness
* Global task and project search

## 🤝 Contributing

Open to contributions! Please open a PR or raise an issue if you'd like to suggest improvements.

## 📄 License

Licensed under the [MIT License](LICENSE).
