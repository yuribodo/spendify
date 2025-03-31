
# Spendify 💰

A personal financial management application built with Fastify, following SOLID principles.

## 📝 About the Project

Spendify is a complete API for personal finance management, allowing users to track expenses and income, categorize transactions, generate reports, and gain financial insights. Built with a focus on development best practices and security.

## 🚀 Features

### User Management
- ✅ User registration with email and password
- ✅ User login
- ✅ Password recovery via email
- ✅ Profile updates (name, email, and password)

### Expense Management
- ✅ Create expenses (description, date, value, category, payment method)
- ✅ View all expenses with pagination
- ✅ Filter expenses (by date, category, payment method, amount)
- ✅ View specific expense details
- ✅ Update existing expenses
- ✅ Delete expenses

### Revenue Management
- ✅ Add income (description, date, value, category, income source)
- ✅ View all revenue with pagination
- ✅ Filter revenue (by date, category, income source, amount)
- ✅ View specific revenue details
- ✅ Update existing revenue 
- ✅ Delete revenue

### Category Management
- ✅ Create categories for both expenses and revenue 
- ✅ View all available categories 
- ✅ Update categories
- ✅ Delete unused categories

### Reports and Insights
- ✅ Financial summary with selectable period
- ✅ Categorized reports (monthly expenses, expense categories, income sources) 
- ✅ Export financial data to CSV or JSON 

### Security and Authentication
- ✅ JWT authentication for protected endpoints 
- ✅ Restricted access to users' own financial data 

## 🔒 Business Rules

- ✅ Revenue cannot have negative values
- ✅ Revenue cannot be created without a category
- ✅ Expenses cannot have negative values
- ✅ Expenses cannot be created without a category
- ✅ Categories in use cannot be deleted
- ✅ Financial records older than 6 months cannot be edited or deleted 
- ✅ Notification when monthly expenses exceed 80% of income 
- ✅ Calculation and display of remaining monthly budget

## 🛠️ Technologies Used

- [Node.js](https://nodejs.org/)
- [Fastify](https://www.fastify.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vitest](https://vitest.dev/) (for testing)
- SOLID principles, Clean Architecture, and DDD

## 🏗️ Non-Functional Requirements

- High concurrency (efficiently handling multiple requests)
- Pagination for expense and revenue listings
- Optimization with caching for repeated queries
- ACID-compliant database
- Error handling for failed requests
- Encryption of sensitive data
- Rate limiting to prevent abuse
- Logging of failed login attempts
- Modular code following SOLID principles and DDD
- Unit and integration tests

## 📋 Prerequisites

- Node.js (v14+)
- NPM or Yarn
- Database (PostgreSQL, MySQL, etc.)

## 🚀 How to Run

1. Clone the repository:
```bash
git clone https://github.com/yuribodo/spendify.git
cd spendify
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit the .env file with your settings
```

4. Run database migrations:
```bash
npm run migrate
# or
yarn migrate
```

5. Start the frontend:
```bash
cd frontend

npm run dev
```

6. Start the backend:
```bash
cd backend

npm run start:dev
```

## 🧪 Tests

Run tests with the command:
```bash
npm run test
# or
yarn test
```

## 🤝 Contributing

1. Fork the project
2. Create a new branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request following the project pattern

### Pull Request Pattern
- 🍕 Feature
- 🐛 Bug Fix
- 🎨 Style
- 🧑‍💻 Code Refactor
- 🔥 Performance Improvements
- ✅ Test
- 🤖 Build
- 📦 Chore
- ⏩ Revert

