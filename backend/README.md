# Todo App Backend

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Database user with permissions to create databases

## Database Setup

### 1. Install PostgreSQL
```bash
# Ubuntu
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql

# Windows
# Download and install from https://www.postgresql.org/download/windows/
```

### 2. Create Database
```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell
CREATE DATABASE tododb;
CREATE USER postgres WITH PASSWORD 'newpassword';
GRANT ALL PRIVILEGES ON DATABASE tododb TO postgres;
\q
```

### 3. Create Todo Table
```bash
# Connect to your database
psql -h localhost -U postgres -d tododb

# Create the todo table
CREATE TABLE todo (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    done BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Exit
\q
```

## Project Structure

```
backend/
├── app.js              # Main application file
├── db.js               # Database connection configuration
├── package.json        # Dependencies and scripts
├── routes/
│   └── todos.js        # Todo routes and controllers
└── README.md           # This file
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hiring-fullstack-todo/backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure database connection in `db.js`:
```javascript
const pool = new Pool({
    user: 'postgres',        // Your PostgreSQL username
    host: 'localhost',       // Your database host
    database: 'tododb',      // Your database name
    password: 'newpassword', // Your PostgreSQL password
    port: 5432,             // PostgreSQL port
});
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

## Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:8000` and automatically restart on file changes.

### Production Mode
```bash
npm start
```
The server will start on `http://localhost:8000`.

## API Endpoints

### Todo Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | Get all todos |
| POST | `/todos` | Create a new todo |
| PUT | `/todos/:id` | Update a todo by ID |
| DELETE | `/todos/:id` | Delete a todo by ID |

### Request/Response Formats

#### Create Todo (POST /todos)
```json
// Request
{
    "title": "Sample task",
    "description": "Task description",
    "done": false
}

// Response
{
    "id": 1,
    "title": "Sample task",
    "description": "Task description",
    "done": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
}
```

#### Update Todo (PUT /todos/:id)
```json
// Request
{
    "title": "Updated task",
    "description": "Updated description",
    "done": true
}

// Response
{
    "message": "Todo updated successfully",
    "todo": {
        "id": 1,
        "title": "Updated task",
        "description": "Updated description",
        "done": true,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
    }
}
```

#### Get All Todos (GET /todos)
```json
// Response
[
    {
        "id": 1,
        "title": "Sample task",
        "description": "Task description",
        "done": false,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
    }
]
```

#### Delete Todo (DELETE /todos/:id)
```json
// Response
{
    "id": 1,
    "title": "Sample task",
    "description": "Task description",
    "done": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (invalid input)
- `500` - Internal Server Error (database or server issues)

Error response format:
```json
{
    "message": "Error description"
}
```

## Environment Variables

You can use environment variables for configuration:

```bash
# Create .env file
DB_USER=postgres
DB_HOST=localhost
DB_NAME=tododb
DB_PASSWORD=newpassword
DB_PORT=5432
PORT=8000
```

Update `db.js` to use environment variables:
```javascript
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
```

## Testing the API

You can test the API using tools like:

- **curl**: Command line HTTP client
- **Postman**: GUI API testing tool
- **Insomnia**: Alternative API testing tool

### Example with curl:
```bash
# Get all todos
curl http://localhost:8000/todos

# Create a todo
curl -X POST http://localhost:8000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test todo","description":"Test description"}'

# Update a todo
curl -X PUT http://localhost:8000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated todo","done":true}'

# Delete a todo
curl -X DELETE http://localhost:8000/todos/1
```

## Deployment Considerations

- Use environment variables for sensitive data
- Implement proper authentication and authorization
- Add rate limiting for API endpoints
- Set up proper logging and monitoring
- Use connection pooling for database
- Consider using a process manager like PM2

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
