# Wexy - Loan Tracker

A loan management web application for tracking customer loans, calculating daily interest (capped at 100%), and managing repayments.

## Tech Stack

- **React 19** with **TypeScript** - UI framework
- **React Router v7** - Client-side routing
- **Tailwind CSS 3** - Utility-first styling
- **Axios** - HTTP client for backend API communication
- **Create React App** - Build tooling

## Features

- **Loan Management** - Add, view, and track loans with daily interest calculations
- **Customer Management** - Register customers with KYC documents (ID, proof of residence, proof of income)
- **Interest Tracking** - Automatic daily interest calculation at 0.7143% per day, capped at 100% of the principal
- **Overflow Tracking** - Tracks interest accrued beyond the 100% cap separately
- **Filtering & Search** - Filter loans by status (Paid/Unpaid) and search by customer name
- **Summary Dashboard** - View totals for amount lent, overflow interest, and expected repayments

## Prerequisites

- Node.js (v16 or higher)
- npm
- A running backend API server (the app expects a REST API for loans and customers)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd wexy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```
REACT_APP_SERVER_URL=http://localhost:8080
```

Set `REACT_APP_SERVER_URL` to the base URL of your backend API.

### 4. Run the development server

```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the development server |
| `npm run build` | Build for production |
| `npm test` | Run tests in watch mode |

## Project Structure

```
src/
├── api.ts                  # Axios instance configured with backend URL
├── App.tsx                 # Root component with route definitions
├── index.tsx               # App entry point
├── components/
│   ├── CustomerForm.tsx    # Customer registration form with file uploads
│   ├── LoanForm.tsx        # Form to add new loans
│   ├── LoanTable.tsx       # Loan listing table with interest calculations
│   └── Navbar.tsx          # Navigation bar
└── pages/
    ├── Home.tsx            # Landing page
    └── Loans.tsx           # Loan management dashboard
```

## API Endpoints

The frontend expects the following backend endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/loans` | Fetch all loans |
| `POST` | `/loans` | Create a new loan |
| `PATCH` | `/loans/:id/mark-paid` | Mark a loan as paid |
| `POST` | `/customers` | Register a new customer (multipart form data) |
