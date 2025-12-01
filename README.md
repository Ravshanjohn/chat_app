# Chat App

A real-time chat application built with JavaScript.

## Features

- Real-time messaging
- User authentication
- Multiple chat rooms support
- Responsive UI
- Emoji support

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

### Installation

Clone the repository:

```bash
git clone https://github.com/Ravshanjohn/chat_app.git
cd chat_app
```

Install dependencies:

```bash
npm install
```

### Running the App

Start the development server:

```bash
npm start
```

Open your browser and visit [http://localhost:3000](http://localhost:3000) to use the chat app.

## Technologies Used

- JavaScript (ES6+)
- Node.js
- Express.js
- Socket.io
- HTML, CSS

## Project Structure

```
chat_app/
├── public/           # Static files (HTML, CSS, client-side JS)
├── src/              # Server-side JS
├── package.json
└── README.md
```

## How It Works

- Users can join chat rooms and send messages in real-time.
- Messages are relayed instantly to all participants in a room using WebSockets (Socket.io).

## License

This project is licensed under the MIT License.
