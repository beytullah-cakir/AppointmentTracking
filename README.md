# Appointment Tracking System (Randevu Takip)

A modern, full-stack web application designed for managing and tracking appointments. The project consists of a robust ASP.NET Core backend and a responsive, dynamic React frontend.

## 🚀 Technologies Used

### Frontend
- **React 19** with **Vite** for fast development and optimized builds.
- **React Router DOM** for seamless client-side routing.
- **Framer Motion** for fluid animations and transitions.
- **Axios** for handling API requests.
- **Date-fns** for comprehensive date and time manipulation.
- **Lucide React** for beautiful, consistent iconography.

### Backend
- **.NET 10** (ASP.NET Core Web API)
- **Entity Framework Core** with **SQL Server** for robust data access.
- **ASP.NET Core Identity & JWT Bearer** for secure authentication and authorization.
- **Hangfire** for reliable background job processing and scheduled tasks.
- **Swagger/OpenAPI** for interactive API documentation and testing.

## 📁 Project Structure

- `/frontend` - The React user interface.
- `/backend` - The ASP.NET Core Web API.

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [.NET 10 SDK](https://dotnet.microsoft.com/)
- SQL Server

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure your database connection string in `appsettings.json`.
3. Apply database migrations:
   ```bash
   dotnet ef database update
   ```
4. Run the API:
   ```bash
   dotnet run
   ```
   The API will be available and you can view the Swagger documentation at the configured local port (e.g., `http://localhost:<port>/swagger`).

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

## 📄 License
This project is licensed under the terms of the included LICENSE file.
