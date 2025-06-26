# Altametrics Internship Project: E-commerce Product Explorer

## Overview

This project was developed as a technical assessment, focusing on building a responsive e-commerce application. The core objective was to demonstrate proficiency in modern front-end development, including state management, API integration, and responsive UI design.

The application leverages **React**, **TypeScript**, **Vite**, and **Tailwind CSS** for a fast and efficient front-end development experience, coupled with **Redux Toolkit** for robust global state management. It integrates with the [Fake Store API](https://fakestoreapi.com) to fetch and display product data, provide user authentication, and offer a dynamic product Browse experience.

Key functionalities include secure user login, a comprehensive dashboard with dark mode, a sortable and filterable product list, the ability for users to assign product ratings (persisted locally), and a detailed product view page. The aim was to create a clean, intuitive, and highly responsive web application.

## Features

### User Authentication & Authorization

- Secure login page using `POST /auth/login` from the Fake Store API.
- Sample credentials: `username: "mor_2314", password: "83r5^_"`
- Stores JWT token in local storage upon successful login for persistent sessions.
- Handles authentication loading states and displays clear error messages for failed login attempts.

### Dashboard & Navigation

- Intuitive dashboard layout with a sidebar and topbar for easy navigation.
- **Dark Mode:** Toggleable dark mode feature for enhanced user experience and visual comfort.
- Full responsiveness, ensuring optimal display and functionality across desktop, tablet, and mobile devices.

### Product List View

- Displays a comprehensive list of products fetched from `GET /products`.
- **Sorting:** Products can be sorted by price (ascending/descending) and rating.
- **Filtering:** Products can be filtered by category (categories fetched from `GET /products/categories`).
- **User Ratings:** Users can assign a star rating to each product.
  - Ratings are stored persistently in `localStorage`.
  - Clicking an already selected star will clear the user's rating.
  - The displayed review count dynamically adjusts to include the user's rating (frontend simulation).

### Product Detail Page

- Clicking on a product card navigates to a dedicated detail page (`GET /products/:id`).
- Displays comprehensive information about the selected product, including image, title, price, description, category, and full rating details.
- Allows users to view and update their personal rating for the product, reflecting the same local storage persistence as the list view.

### Error Handling & User Experience

- Robust error handling for all API requests, providing clear feedback to the user in case of failures.
- Loading spinners and messages indicate ongoing data fetches, improving perceived performance.
- Optimized for a smooth and responsive user experience.

## Technologies

### Frontend

- **React:**
- **TypeScript:**
- **Vite:**
- **Redux Toolkit:**
- **Tailwind CSS:**

### API

- [Fake Store API](https://fakestoreapi.com): Used for product data (`GET /products`, `GET /products/:id`, `GET /products/categories`) and user authentication (`POST /auth/login`).

## Project Structure

- `src/features`: Contains Redux slices, components, and pages related to specific application features (e.g., `products`, `auth`).
- `src/components`: Reusable UI components.
- `src/hooks`: Custom React hooks for shared logic.
- `src/api`: API service configurations.
- `src/store`: Redux store configuration.
- `src/types`: TypeScript type definitions.

## Setup Instructions

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn (Vite typically uses npm by default, but Yarn also works)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/bostiog1/Altametrics-Project-Interview.git
    cd Altametrics-Project-Interview
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

The application should now be running in your browser, typically at `http://localhost:5173/`.
