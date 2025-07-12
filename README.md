# VukaLink - Internship Platform

A modern, full-stack internship platform built with React, Vite, and Supabase. Connect students with internship opportunities and help companies find talented interns.

## 🚀 Features

### For Students
- Browse and search internship opportunities
- Apply to internships with cover letters and resume uploads
- Track application status
- Save favorite opportunities
- Chat with companies
- Manage profile and portfolio

### For Companies
- Post and manage internship opportunities
- Review and manage applications
- Chat with applicants
- Analytics dashboard
- Company profile management

### Platform Features
- Multi-tenant architecture with Row Level Security (RLS)
- Real-time messaging
- File uploads (resumes, company logos)
- Dark mode support
- Mobile-responsive design
- PWA capabilities

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **State Management**: Redux Toolkit
- **Forms**: Formik + Yup validation
- **UI Components**: Heroicons, Lucide React
- **Notifications**: React Toastify
- **Routing**: React Router DOM

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd vukalink
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and configure your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase configuration:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Run the database schema from `DATABASE.md` in your Supabase SQL editor to create all necessary tables, policies, and functions.

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🗄️ Database Schema

The application uses a multi-tenant architecture with the following key tables:

- `students` - Student profiles
- `companies` - Company profiles  
- `internships` - Internship opportunities
- `applications` - Student applications
- `saved_opportunities` - Bookmarked opportunities
- `chats` & `messages` - Messaging system
- `audit_log` - Change tracking

All tables have Row Level Security (RLS) policies to ensure data isolation between organizations.

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── features/           # Feature-based modules
│   ├── auth/          # Authentication
│   ├── dashboard/     # Dashboard components
│   ├── opportunities/ # Opportunity management
│   ├── applications/  # Application system
│   ├── messages/      # Messaging system
│   ├── company/       # Company-specific features
│   └── user/          # User profile management
├── services/          # API and external services
├── hooks/             # Custom React hooks
├── context/           # React context providers
├── utils/             # Utility functions
└── config/            # Configuration files
```

## 🔐 Authentication & Authorization

The application uses Supabase Auth with role-based access control:

- **Students**: Can browse opportunities, apply, and manage their profile
- **Company Admins**: Can post opportunities, manage applications, and chat with students
- **Admins**: Full platform access

## 🎨 Styling

The application uses Tailwind CSS with a custom design system:
- Dark mode support
- Responsive design
- Consistent spacing and typography
- Custom color palette

## 📦 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.
