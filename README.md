# 🚗 Rental Car Frontend | React/TypeScript

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)

## 🔗 Full System Architecture
Modern frontend application for car rental management, designed to work with the [Spring Boot backend](https://github.com/Giorgio-Rossi/backend-rental-car).


## ✨ Key Features
- **JWT Authentication Flow** with token refresh
- **Role-based UI** (Admin Dashboard / Customer Portal)
- **Responsive Design** with mobile-first approach
- **State Management** with React Context API
- **Form Validation** with React Hook Form
- **Integrated Testing** with Jest and React Testing Library
- **Docker-ready** containerization

## 📦 Tech Stack
| Category       | Technologies                          |
|----------------|---------------------------------------|
| Core           | React 18, TypeScript 5                |
| State          | Context API, useReducer               |
| Styling        | Tailwind CSS, CSS Modules             |
| HTTP Client    | Axios                                 |
| Forms          | React Hook Form, Zod validation       |
| Testing        | Jest, React Testing Library           |
| Tools          | Docker, Vite, ESLint                  |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Running [backend service](https://github.com/Giorgio-Rossi/backend-rental-car#-quick-start)

### Local Development
1. Clone the repo:
   ```bash
   git clone https://github.com/Giorgio-Rossi/react-rental-car.git
   ```
2. Configure the enviroment:
   ```bash
   cp .env.example .env
   ```
   Edit .env:
   ```bash
   VITE_API_URL=http://localhost:8080/api
   ```
3. Install dependencies:
   ```bash
   mvn clean install
   ```
4. Start the application:
   ```bash
   npm run dev
   ```
## 🐳 Docker Deployment
```bash
docker-compose up --build
```
Access at: http://localhost:8080

##🖥️ UI Components
| Route             | Description              | Access Level |
|-------------------|--------------------------|--------------|
| /login            | Authentication portal    | Public       |
| /dashboard        | Admin management console | Admin        |
| /reservations     | Booking management       | Customer     |
| /vehicle-catalog  | Browse available vehicles| Public       |

Sample Admin Credentials:
```bash
{
  email: "admin@rental.com",
  password: "admin123"
}
```

##🧪 Testing Strategy
- Unit Tests: Component rendering (80% coverage)
- Integration Tests: API interaction mocks
- E2E Tests: Coming soon (Cypress)

Run tests:
```bash
npm test
```

##📂 Project Structure
src/
├── assets/            # Static files
├── components/
│   ├── auth/         # Auth forms
│   ├── common/       # Shared UI
│   └── vehicles/     # Car listings
├── contexts/         # State management
├── hooks/            # Custom hooks
├── services/         # API clients
├── types/            # TypeScript definitions
├── utils/            # Helpers
└── views/            # Page components


🤝 API Integration
Key Endpoints Consumed
```bash
// Example API service
export const loginUser = async (credentials: LoginDTO) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/login`, 
    credentials
  );
  return response.data;
};
```

Error Handling
```bash
// Typical error boundary
<AuthProvider>
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
</AuthProvider>
```

## 🤝 How to Contribute
1. Fork both frontend and backend
2. Create matching feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open coordinated Pull Request


Connect with me: [[LinkedIn](https://www.linkedin.com/in/rossi-giorgio/)]
