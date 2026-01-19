

  
<div align="center">
  
 [![hsz](https://github.com/user-attachments/assets/2c66377a-1d46-4d8b-83e6-6a57ace25f54)](https://blog.yuhari.app/)
  
</div>
 

A modern, minimalist blog platform built with Next.js and Tailwind CSS, featuring a clean UI, rich content editing, and a full-featured admin panel. This project uses the **"Tech Noir Minimal"** design system.

## ✨ Features

- **Tech Noir Minimal Design** — High contrast, monochrome aesthetic with clean typography
- **Rich Content Editor** — Support for images, YouTube embeds, and formatting
- **Admin Dashboard** — Comprehensive management for posts, categories, and users
- **Authentication** — Secure login system with role-based access control
- **Optimized Performance** — Fast page loads with Next.js and MongoDB

## 📸 Screenshots

<div align="center">
  
  ![Blog](https://github.com/user-attachments/assets/2fb32285-6f6e-41da-8d9c-7ab3c4ebccb9)

 ![image](https://github.com/user-attachments/assets/c3d71832-d60c-4c1b-b87e-ff829fc51dc5)

</div>

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB database

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
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://your_mongo_url
   JWT_SECRET=your_jwt_secret
   # AWS S3 / R2 Configuration (Optional for image upload)
   R2_ACCESS_KEY_ID=your_access_key
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET_NAME=your_bucket_name
   R2_ACCOUNT_ID=your_account_id
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
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM
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
- Image upload (AWS S3 / Cloudflare R2 support)

## 🔄 Deployment

For production deployment:

```bash
npm run build
npm start
```


## 🔒 License

This project is licensed under the MIT License - see the LICENSE file for details.


## 👥 Contributors

- [Jiranon-K](https://github.com/Jiranon-K) - Developer

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Jiranon-K">Jiranon-K</a>
</p>

