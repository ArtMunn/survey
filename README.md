# Survey Application

This is a simple MERN stack application that records how customers found out about a product and allows browsing of the collected data.

## Setup

### Backend (server)

1. Copy `.env.example` to `.env` in `server/` and update `MONGO_URI` if needed.
2. Install dependencies:
   ```bash
   cd server
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   The server runs on port 5000 by default.

### Frontend (client)

1. Install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Start the React app:
   ```bash
   npm start
   ```
   The app will proxy API requests to `http://localhost:5000`.

## Usage

- Open the React app in a browser.
- Enter how a customer heard about the product and submit.
- See the list of entries below the form.

## Notes

- Ensure MongoDB is running and accessible at the connection string in `.env`.
- The server exposes two endpoints:
  - `POST /api/sources` — add a new source entry
  - `GET /api/sources` — list all entries
