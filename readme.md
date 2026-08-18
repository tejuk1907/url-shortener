# URL Shortener

A full-stack URL shortening application built with **React.js** and **Express.js**. Users can turn long URLs into compact links and use those links to redirect to the original destination.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js and Express.js
- **API:** REST
- **Database:** Add your preferred database, such as MongoDB or PostgreSQL

## Suggested Project Structure

```text
URL Shortener/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
├── .gitignore
└── readme.md
```

## Features

- Create a short URL from a long URL
- Redirect short links to their original URLs
- Validate submitted URLs
- Copy generated links to the clipboard
- Display clear loading and error states
- Optional click tracking and link history

## Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) 18 or newer
- npm
- A database, if the backend persists links

### Installation

Clone the repository and install the frontend and backend dependencies:

```bash
git clone <repository-url>
cd "URL Shortener"

cd server
npm install

cd ../client
npm install
```

### Environment Variables

Create a `.env` file inside `server`:

```env
PORT=5000
BASE_URL=http://localhost:5000
DATABASE_URL=<your-database-connection-string>
```

If the React application needs an explicit API URL, create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

> If the client uses Create React App instead of Vite, name the variable `REACT_APP_API_URL`.

## Running the Application

Start the Express server:

```bash
cd server
npm run dev
```

In another terminal, start the React application:

```bash
cd client
npm run dev
```

The default local addresses are:

- React app: `http://localhost:5173`
- Express API: `http://localhost:5000`

Exact commands and ports depend on the scripts configured in each `package.json`.

## API Endpoints

### Create a short URL

```http
POST /api/urls
Content-Type: application/json
```

Request body:

```json
{
  "url": "https://example.com/a/very/long/url"
}
```

Example response:

```json
{
  "shortUrl": "http://localhost:5000/abc123",
  "originalUrl": "https://example.com/a/very/long/url"
}
```

### Redirect to the original URL

```http
GET /:shortCode
```

The server responds with an HTTP redirect to the stored original URL.

## Useful Scripts

Common scripts for both applications include:

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm test          # Run tests
```

Update this section to match the scripts in the project's `package.json` files.

## Production Notes

- Validate URLs on the server; do not rely only on client-side validation.
- Generate unique, hard-to-guess short codes.
- Add rate limiting to the URL creation endpoint.
- Restrict CORS to trusted frontend origins.
- Store secrets in environment variables and keep `.env` files out of Git.
- Use HTTPS in production.

## License

Add the license that applies to this project.
