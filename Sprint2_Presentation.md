# Luxor Perfumería - Sprint 2 Presentation
## Project: Luxor-proj
## Goal: Full-Stack Integration & User Flow

---

## 1. Executive Summary
In Sprint 2, we transformed a static frontend into a **dynamic full-stack application**. We implemented a robust backend, a persistent database, and core e-commerce functionalities including Authentication and Cart management.

---

## 2. Technical Achievements (The "Brain")
### Backend Infrastructure
- **Technology**: Node.js with Express.
- **Database**: PostgreSQL integration for persistent user and product data.
- **RESTful API**:
    - `GET /products`: Fetches full catalog.
    - `GET /products/:id`: Fetches specific perfume details (notes, description).
    - `POST /login`: Secure authentication endpoint.

### State Management
- **AuthContext**: Global state for user sessions (Login/Logout).
- **CartContext**: Global state for shopping cart persistence.

---

## 3. Key Features Delivered
### 🛡️ Authentication System
- Integrated Login page with validation.
- Backend verification of credentials against the database.
- Secure token-based approach (placeholder for JWT).

### 🛒 Shopping Cart
- Users can now add/remove items.
- Real-time total calculation.
- Context-based state that persists across different pages.

### 🧪 Dynamic Catalog & Details
- **Perfumes Page**: Automatic rendering of products from the API.
- **Product Detail Page**: Dynamic routing (`/producto/:id`) showing specific olfactory notes (Top, Heart, Base notes).

---

## 4. UI/UX Improvements
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop.
- **Component Architecture**: 
    - Reusable `Button`, `Typography`, and `Container` components.
    - Feature-driven folders (`brand`, `cta`, `perfumes`).
- **Smooth Navigation**: Implemented `react-router-dom` with `ScrollToTop` utility.

---

## 5. Technical Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS, PostCSS |
| **Routing** | React Router 7 |
| **Backend** | Node.js, Express |
| **Database** | PostgreSQL |

---

## 6. Live Demo Flow
1. **Landing Page**: View featured perfumes and brand story.
2. **Login**: Authenticate to access personalized features.
3. **Explore**: Browse the full catalog in the Perfumes page.
4. **Inspect**: View detailed notes of a specific fragrance (e.g., Lattafa Khamrah).
5. **Purchase**: Add to cart and manage items in the Cart page.

---

## 7. Next Steps (Sprint 3)
- **Payment Gateway**: Integration with Stripe or PayPal.
- **User Dashboard**: Order history and profile management.
- **Admin Panel**: CRUD operations for inventory management.
- **Search & Filters**: Advanced search by brand, price, or notes.

---
*Created for Sprint 2 Review - April 2026*
