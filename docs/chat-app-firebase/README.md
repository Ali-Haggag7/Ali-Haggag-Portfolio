<div align="center">

  <h1>💬 Realtime Chat Engine</h1>
  
  <p>
    A high-performance, <b>Serverless Messaging Architecture</b> built with <b>React & Vite</b>.
    Powered by <b>Firebase</b> for instant data syncing and <b>Cloudinary</b> for optimized media handling.
  </p>

  <p>
    <img src="https://img.shields.io/badge/React_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
    <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
  </p>

  <br />

  <img src="/chat-firebase-1.jpeg" alt="Project Preview" width="100%" style="border-radius: 10px;" />

</div>

<br />

## 🔥 Key Features

### ⚡ Performance & Architecture
* **Serverless Backend:** Fully managed backend using **Firebase** (Auth, Firestore/Realtime DB) for zero-maintenance scalability.
* **Instant Sync:** Real-time listeners ensure messages appear instantly without page reloads.
* **Lightning Fast:** Built with **Vite** for optimized bundling and instant HMR (Hot Module Replacement).

### 🎨 User Experience
* **Secure Identity:** Robust authentication system managed via Firebase Auth.
* **Rich Media:** Seamless image uploads and optimization using **Cloudinary API**.
* **Responsive UI:** A clean, mobile-first interface designed for all screen sizes.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend Core** | React.js, Vite, Context API |
| **Backend (BaaS)** | Firebase (Firestore, Auth) |
| **Media Engine** | Cloudinary (Upload Widget/API) |
| **Styling** | CSS3 (Modular & Responsive) |

---

## 🚀 Getting Started Locally

Follow these steps to set up the chat engine on your machine:

1. **Clone & Install**
```bash
# Clone the repository
git clone [https://github.com/Ali-Haggag7/Realtime-Chat-Engine.git](https://github.com/Ali-Haggag7/Realtime-Chat-Engine.git)
cd Realtime-Chat-Engine

# Install dependencies
npm install

```
2. **Environment Setup (.env)**
```bash
# Create a .env file in the root directory. You need to setup a Firebase project and a Cloudinary account.
  VITE_API_KEY=your_firebase_api_key
  VITE_AUTH_DOMAIN=your_project.firebaseapp.com
  VITE_PROJECT_ID=your_project_id
  VITE_STORAGE_BUCKET=your_project.appspot.com
  VITE_MESSAGING_SENDER_ID=your_sender_id
  VITE_APP_ID=your_app_id
  VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
  VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

```
3. **Run the App**

```bash
# Start development server
npm run dev

```

The app will launch at http://localhost:5173

## 📸 Interface Previews

| **Chat Room** | **Mobile View** |
| :---: | :---: |
| <img src="/chat-firebase-1.jpeg" width="100%" /> | <img src="/chat-firebase-2.jpeg" width="100%" /> |

---

<div align="center">
  <br />
  <p>Made with ❤️ by <b>Ali Haggag</b></p>
  
  <a href="https://www.linkedin.com/in/ali-haggag7/">
    <img src="https://img.shields.io/badge/Connect-LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="mailto:ali.haggag2005@gmail.com">
    <img src="https://img.shields.io/badge/Contact-Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
  <a href="https://github.com/Ali-Haggag7">
    <img src="https://img.shields.io/badge/Portfolio-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  
  <br />
  <br />
  <p><i>"Smooth messaging. Instant updates."</i></p>
</div>
