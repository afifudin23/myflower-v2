<div align="center">
    <!-- https://icons8.com/icons -->
    <img width="96" height="96" src="https://raw.githubusercontent.com/afifudin23/myflower-v2/main/public/assets/images/rose.png" alt="myrekap-logo"/>
</div>

<h1 align="center">MyFlower – Smart and Simple Flower Ordering System</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v22.18.0-tosca?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-4.21.2-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-v5.6.3-0D99FF?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-v3.3.2-38BDF8?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/React%20Router%20DOM-v7.1.1-CA4245?logo=reactrouter&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-v5.0.6-764ABC?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Zod-v3.24.1-2D3748?logo=zod&logoColor=white" />
  <img src="https://img.shields.io/badge/Midtrans-Payment%20Gateway-0D99FF?logo=midtrans&logoColor=white" />
  <img src="https://img.shields.io/badge/Brevo-Email%20Service-98ff98?logo=brevo&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" />
</p>

**MyFlower** is an application designed to simplify flower ordering and sales management, allowing users to browse, order, and track flowers easily in real time.  
Built with a modern frontend and robust backend integration, it ensures a smooth and efficient experience for both customers and sellers.

---

## Table of Contents

-   [Features](#features)
-   [Tech Stack Required](#tech-stack-required)
-   [Getting Started](#getting-started)
    -   [Initial Step](#1-initial-step)
    -   [Setup App](#2-setup-app)
-   [Documentation](#documentation)
    -   [Demo Features](#demo-features)

---

## Features

The MyFlower service focuses on sales management for a flower shop, allowing users to:

-   Online Ordering – Browse and order flowers easily
-   Shopping Cart – Add and manage items before checkout
-   Payment Integration – Secure payments handled via Midtrans Snap
-   Order History & Receipt – View past orders and print digital receipts
-   Product Reviews – Submit product feedback and ratings
-   Order Tracking – Monitor order progress and delivery status
-   Notifications – Automatically send order status updates to the customer and manager when orders are created or updated

---

## Tech Stack Required

-   **Tools:**
    -   React.js (v18.3)
    -   Vite (v6.0)
    -   TypeScript (v5.6)
    -   Tailwind CSS (v3.3)
    -   React Router DOM (v7.1)
    -   Zustand (v5.0)
    -   Zod (v3.24)
-   **Package Manager:**
    -   npm (v10.9)
-   **Third-Party Service:**
    -   Brevo (for notification emails)
    -   Midtrans (for payment gateway)

---

## Getting Started

Before starting, make sure you have Node.js installed.  
It’s **recommended to use NVM (Node Version Manager)** so you can easily switch between different Node.js versions.

## 🧩 Install Node.js (Recommended via NVM)

To manage Node.js versions easily, it’s **recommended** to install it using **NVM (Node Version Manager)**.

Please follow the installation guide for your platform:

-   **Windows:** [NVM for Windows Documentation](https://github.com/coreybutler/nvm-windows)
-   **Linux / macOS:** [Official NVM Repository](https://github.com/nvm-sh/nvm)

Once NVM is installed, verify and set up Node.js:

```bash
nvm -v            # Check if NVM is installed
nvm install 22.18.0
nvm use 22.18.0
node -v           # Verify Node.js version
npm -v            # Verify npm version

```

### 1. Initial Step:

```bash
git clone git@github.com:afifudin23/myflower-v2.git
cd myflower-v2
```

### 2. Setup (App)

Go to the frontend folder and install dependencies:

```bash
npm install
```

Copy .env.example to .env and set your configuration:

```bash
# System
VITE_BASE_API_URL=               # The base URL of your backend API, default http://localhost:5000

```

Build the application for production:

```bash
npm run build
```

Run the app in preview mode:

```bash
npm run preview         # Default PORT: 5001
```

The app will be available at:

```bash
http://localhost:<PORT>                   # Default PORT: 5001
```

## Documentation

### Demo Features

Explore the main frontend features and usage of MyFlower through the following live demos:

-   Setup Guide: [View Demo](https://jam.dev/c/fab4b543-1a83-4838-8d6a-0551aee3ec31)  
    Step-by-step setup instructions showing how to install and configure MyFlower properly.

-   Usage Overview: [View Demo](https://jam.dev/c/672a4148-fbbc-45cc-9922-2ee4c45ba40c)  
    Demonstration of how to use MyFlower features including product browsing, checkout, and order tracking.
