

  
<div align="center">
  
 [![hsz](https://github.com/user-attachments/assets/2c66377a-1d46-4d8b-83e6-6a57ace25f54)](https://blog.hoshizora.online/)
  
</div>
 

A modern, minimalist blog platform built with Next.js and Tailwind CSS, featuring a clean UI, rich content editing, and a full-featured admin panel.

## ✨ Features

- **Modern Design** — Clean, responsive UI with light/dark mode support
- **Rich Content Editor** — Support for images, YouTube embeds, and formatting
- **Admin Dashboard** — Comprehensive management for posts, categories, and users
- **Authentication** — Secure login system with role-based access control
- **Optimized Performance** — Fast page loads with Next.js
  
## 📸 Screenshots

<div align="center">
  
  ![Blog](https://github.com/user-attachments/assets/2fb32285-6f6e-41da-8d9c-7ab3c4ebccb9)

 ![image](https://github.com/user-attachments/assets/c3d71832-d60c-4c1b-b87e-ff829fc51dc5)

</div>

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MySQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hoshizora-blog.git
   cd hoshizora-blog
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   ```
   DB_HOST=your_db_host
   DB_PORT=your_db_port
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   JWT_SECRET=your_jwt_secret
   ```

4. Initialize the database:

   
   ```
   USERS {
        int id PK
        varchar username UK
        varchar email UK
        varchar password
        varchar display_name
        varchar avatar
        varchar title
        text bio
        enum role
        timestamp created_at
        timestamp updated_at
    }

    CATEGORIES {
        int id PK
        varchar name
        varchar slug UK
        timestamp created_at
        timestamp updated_at
    }

    POSTS {
        int id PK
        varchar title
        varchar slug UK
        text description
        longtext content
        varchar featured_image
        enum status
        int views
        int user_id FK
        int category_id FK
        timestamp created_at
        timestamp published_at
        timestamp updated_at
    }


   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 🏗️ Project Structure

```
├── app/                  # Next.js app directory
│   ├── admin/            # Admin dashboard components
│   ├── api/              # API routes
│   ├── blog/             # Blog pages and components
│   ├── components/       # Shared components
│   ├── hooks/            # Custom React hooks
│   └── styles/           # CSS styles
├── lib/                  # Utility functions and services
├── public/               # Static assets
└── ...
```

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [DaisyUI](https://daisyui.com/) - Tailwind CSS component library
- [TipTap](https://tiptap.dev/) - Rich text editor
- [MySQL](https://www.mysql.com/) - Database
- [JWT](https://jwt.io/) - Authentication

## 📝 Features in Detail

### Blog Features
- Category-based article organization
- Featured posts and latest articles sections
- Responsive design for all devices
- Rich content with embedded media

### Admin Features
- Dashboard
- Post management (create, edit, delete)
- Category management
- User management with role-based permissions
- Image upload 

## 🔄 Deployment

For production deployment:

```bash
npm run build
npm start
```

## 👥 Contributors

- [Jiranon-K](https://github.com/Jiranon-K) - Developer

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Jiranon-K">Jiranon-K</a>
</p>
