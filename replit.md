# replit.md

## Overview

This is a task and goal management application built with a React frontend and Express.js backend. The app is designed as a Telegram Web App (TWA) for personal productivity tracking, allowing users to manage daily tasks, set long-term goals, track achievements, and view their progress through various interfaces including a calendar view and dashboard.

The application features a modern UI built with shadcn/ui components, uses Drizzle ORM for database operations with PostgreSQL, and includes comprehensive task management capabilities with categories, time tracking, and goal completion tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration for client-side builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and CSS variables
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Forms**: React Hook Form with Zod validation
- **Layout**: Mobile-first responsive design with bottom navigation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Module System**: ES modules throughout the application
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot reload with Vite middleware integration
- **Request Logging**: Custom middleware for API request/response logging

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Design**: Four main entities (users, tasks, goals, achievements) with proper foreign key relationships
- **Migration System**: Drizzle Kit for schema migrations
- **Storage Interface**: Abstract storage interface with in-memory implementation for development

### Data Models
- **Users**: Basic user information with optional Telegram integration
- **Tasks**: Daily tasks with categories, time slots, completion status, and date tracking
- **Goals**: Long-term objectives with progress tracking, target values, and deadlines
- **Achievements**: User accomplishments with different types (streaks, milestones, goal completions)

### Authentication & User Management
- **Telegram Integration**: Built-in support for Telegram Web App user authentication
- **User Identification**: Supports both username-based and Telegram ID-based user lookup
- **Session Management**: Designed to work within Telegram Web App context

### Development & Build System
- **Development Server**: Vite dev server with Express API proxy
- **Build Process**: Separate frontend (Vite) and backend (esbuild) build processes
- **TypeScript**: Strict TypeScript configuration with path mapping
- **Code Organization**: Shared schema and types between frontend and backend

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver for database connectivity
- **drizzle-orm**: Modern TypeScript ORM for database operations
- **drizzle-kit**: CLI tool for database migrations and schema management
- **express**: Web application framework for the backend API
- **react**: Frontend framework for building the user interface
- **vite**: Build tool and development server

### UI and Styling
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Utility for handling conditional CSS classes
- **lucide-react**: Icon library with React components

### Data Management and Validation
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form management with validation
- **@hookform/resolvers**: Form validation resolvers including Zod integration
- **zod**: TypeScript-first schema validation library
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation

### Development and Build Tools
- **typescript**: Static type checking for JavaScript
- **@vitejs/plugin-react**: Vite plugin for React support
- **esbuild**: Fast JavaScript/TypeScript bundler for backend builds
- **tsx**: TypeScript execution environment for development

### Telegram Integration
- **Telegram Web Apps API**: Browser-based API for Telegram Web App integration (loaded via CDN)

### Database Connection
- **PostgreSQL**: Primary database system accessed through Neon serverless platform
- **Connection Management**: Environment-based database URL configuration