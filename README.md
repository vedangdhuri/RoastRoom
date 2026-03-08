# 🎙️ RoastRoom - Frontend

Welcome to the **RoastRoom Frontend**! This is a modern, high-performance web application built with **Next.js 14**, designed to provide an immersive and interactive "roast and debate" experience.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1.  **Clone the repository** (if you haven't already):

    ```bash
    git clone https://github.com/your-username/RoastRoom.git
    cd RoastRoom/frontend
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Real-time**: [Socket.io Client](https://socket.io/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **API Client**: [Axios](https://axios-http.com/)

---

## 📁 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `public/`: Static assets (images, fonts).
- `node_modules/`: Project dependencies.
- `tailwind.config.js`: Tailwind CSS configuration.
- `next.config.mjs`: Next.js configuration.

---

## 📜 Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to find and fix problems in your code.

---

## 🔌 Connecting to the Backend

Ensure your `.env.local` file is configured with the correct API and Socket URLs. See `.env.example` for reference.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## ✨ Features

- 🎭 **Real-time Roasts**: Engage in live roasting sessions with other users.
- ⚡ **Seamless Interactions**: Instant feedback and updates powered by WebSockets.
- 🎨 **Premium UI**: Crafted with Tailwind CSS and smooth animations via Framer Motion.
- 🔔 **Interactive Feedback**: Real-time toasted notifications.

---

Made with ❤️ by the RoastRoom Team.
