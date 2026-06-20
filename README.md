# IW-One-Portal Setup Guide

This guide will help you run the website locally on your machine using **Vite**.

By the end, you’ll have the app running at:
👉 http://localhost:5173

---

## 1. Prerequisites

Make sure you have the following installed:

- **Node.js (v24.15.0)**  
  Check with:
  node -v

- **npm (comes with Node)**  
  Check with:
  npm -v

If not installed, download from: https://nodejs.org/ and install the LTS version.

---

## 2. Clone or Download the Project

Then clone the repo using the following command and then navigate into the folder:

```
git clone https://github.com/msspranavasai/iw-one-portal.git
```

```
cd iw-one-portal/website
```

---

## 3. Install Dependencies

Run this inside the project folder:

```
npm install
```

This installs all required packages.

---

## 4. Create `.env` File (IMPORTANT & TO BE KEPT SECRET)

This project uses environment variables to securely connect to Supabase.

### Step 1: Create the file

In the root folder, create a file named:

```
.env
```

### Step 2: Add the following variables

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 5. Get Credentials from Supabase

Your Supabase credentials are stored securely in **Proton Pass**.

Steps:

1. Go to this link: https://supabase.com/dashboard/project/rvcronfsjghrpskywlwh
2. Under the title `IW-One-Portal` you will see a url with a copy button beside
3. Copy:
   - Project URL → paste into VITE_SUPABASE_URL
   - Publishable Key → paste into VITE_SUPABASE_ANON_KEY

Make sure:

- No extra spaces
- No quotes around values

---

## 6. Run the Project

Start the development server:

```
npm run dev
```

You should see something like:

➜ Local: http://localhost:5173/

Open your browser and go to:
http://localhost:5173

---

## What’s Happening

- Vite = frontend dev server
- localhost:5173 = your local app
- .env = stores secrets
- Supabase = backend service

---

## You're Good to Go!

If something breaks or is not working as expected, please send me a message and I will get to it ASAP.
