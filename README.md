# URL Shortener

A URL shortener service that creates short URLs ending with "-zag-eng".

## Features

- Shorten any URL
- Custom short URL format
- Copy to clipboard functionality
- MongoDB database storage

## Deployment Instructions

1. Create a Render.com account
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the following environment variables in Render:
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: 10000 (or any available port)

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a .env file with:
```
MONGODB_URI=your_mongodb_connection_string
PORT=300
```

3. Run the development server:
```bash
npm run dev
```

4. Access the application at http://localhost:300

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd url-shortener
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your MongoDB connection string:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

If you're using a local MongoDB installation, you can leave the MONGODB_URI empty as it will default to `mongodb://localhost:27017/url-shortener`.

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter a long URL in the input field
2. Click "Shorten URL"
3. Copy the shortened URL using the "Copy" button
4. Share the shortened URL with others

## API Endpoints

- `POST /api/shorten`: Create a new shortened URL
- `GET /:shortUrl`: Redirect to the original URL

## Technologies Used

- Node.js
- Express.js
- MongoDB
- HTML5
- CSS3
- JavaScript (ES6+)