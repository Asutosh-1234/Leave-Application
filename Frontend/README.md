# LeaveManager — Frontend Client

A sleek, responsive, and high-performance frontend client for the **LeaveManager** system. This Single-Page Application (SPA) allows organization employees to request time off, track application progress, and manage pending requests. It also provides a centralized administration portal for reviewing, filtering, and processing leave requests.

Built using **React 19**, **Vite**, and styled with **Tailwind CSS v4** and **Shadcn UI**.

---

## 🚀 Key Features Implemented

* **Secure Authentication & Registration:**
  - Responsive Sign-in and Sign-up screens utilizing validation form controls.
  - Context-driven state management (`AuthContext`) initializing user sessions securely via `localStorage`.
  - Google Authentication button placeholders.
* **Role-Based Router Protection:**
  - Automated Client Route Guards (`ProtectedRoute.jsx`) protecting private dashboards from unauthenticated sessions.
  - Permission-aware routing (`RoleRoute`) ensuring strict segregation between Employee (`user` role) and Management (`admin` role) panels.
* **Self-Service Employee Dashboard (`/employee`):**
  - Collage card displaying active leave requests.
  - Interactive "New Request" date selection picker, automatically restricting historical start date entries and enforcing that end dates fall on or after start dates.
  - Interactive actions to **Edit** or **Delete** pending requests. Historical and processed entries are safely locked.
* **Admin Management Console (`/admin`):**
  - Consolidated organizational ledger displaying submitted applications.
  - Horizontal filter controls grouping entries by Start Date, End Date, or current Status (`pending`, `approved`, `canceled`).
  - Slide-in details modal illustrating detailed applicant reasons and metadata.
  - Decision inputs providing managers text remark areas and interactive approval/rejection keys.
* **Global Network Handlers:**
  - Dynamic Axios configuration equipped with request interceptors to auto-inject Bearer tokens.
  - Response interceptor catching incoming `401 Unauthorized` codes to automatically flush active local credentials and redirect invalid sessions.

---

## 🛠️ Technology Stack

- **Framework Library:** React 19.2.6 & React DOM 19.2.6
- **Asset Compiler:** Vite 8.0.12
- **Routing Engine:** React Router DOM 7.15.1
- **API Connector:** Axios 1.16.1
- **Styling Suite:** Tailwind CSS v4.3.0 & `@tailwindcss/vite`
- **Component Kit:** Radix UI and Shadcn UI builders
- **Typography:** Geist Variable Sans Font (`@fontsource-variable/geist`)

---

## 📁 Core Directory Structure

```
Frontend/
├── public/                 # Static public assets
├── src/
│   ├── components/
│   │   ├── ui/             # Shadcn Design System components (Button, Input, Card, etc.)
│   │   ├── DashboardLayout.jsx # Standardized grid frame and sticky navigation
│   │   ├── ProtectedRoute.jsx  # Client authorization route guards
│   │   ├── login-form.jsx  # Sign-in component with local cache utilities
│   │   └── signup-form.jsx # Sign-up form checking requirements
│   ├── context/
│   │   └── AuthContext.jsx # Global user authentication status provider
│   ├── lib/
│   │   ├── axios.js        # Auth-injected API instance
│   │   └── utils.js        # Helper functions
│   ├── pages/
│   │   ├── AdminDashboard.jsx    # Managed console with detail drawers and filters
│   │   └── EmployeeDashboard.jsx # Form controller and list representation
│   ├── App.jsx             # SPA React Route declarations
│   ├── index.css           # Styling configuration and variables
│   └── main.jsx            # React root mount and setup wrappers
```

---

## 💻 Local Development Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (LTS Version recommended) along with the package manager `npm`.

### Installation Steps

1. **Navigate into the directory:**
   ```bash
   cd Frontend
   ```

2. **Install all required node packages:**
   ```bash
   npm install
   ```

3. **Verify API Endpoint configuration:**
   The client directs REST calls to `http://localhost:8000/api/v1` via [axios.js](file:///c:/users/panda/OneDrive/Desktop/Internship/Project1/Frontend/src/lib/axios.js). Ensure your backend service is running locally on port `8000`.

4. **Launch development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   Open the logged URL (usually [http://localhost:5173/](http://localhost:5173/)) in your favorite web browser.

---

## ⚙️ Build and Production

To bundle the application static assets optimized for production, run:
```bash
npm run build
```
This generates standard static bundle outputs within the `/dist` directory, ready to be hosted by high-availability static storage servers (e.g. Nginx, Vercel, S3).
