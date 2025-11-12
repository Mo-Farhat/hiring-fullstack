

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx          # Main todo application component
│   └── api/
│       └── todo.ts       # API functions for todo operations


```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hiring-fullstack-todo/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Use this script for development

- `npm run dev` - Start development server


## API Integration

The frontend communicates with a backend API through the following endpoints:

- `GET /todos` - Fetch all todos
- `POST /todos` - Create a new todo
- `PUT /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

## Form Validation

The application includes comprehensive form validation:

### Title Field
- Required field
- Minimum 3 characters
- Maximum 100 characters
- Real-time validation feedback

### Description Field
- Optional field
- Maximum 500 characters
- Real-time validation feedback

### Validation Features
- Visual error states with red borders
- Descriptive error messages
- Error clearing on user input
- Form submission blocking until validation passes

