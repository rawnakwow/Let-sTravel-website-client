# ✈️ Let'sTravel

## Online Ticket Booking Platform

**Let'sTravel** is a modern and responsive online ticket booking platform where users can search, explore, book, and pay for travel tickets for Bus, Plane, Train, and Cruise/Launch services.

The application provides separate dashboards and functionalities for **User, Vendor, and Admin** roles.

---

## 🌐 Live URL

**Live Website:**  https://let-s-travel-website-client.vercel.app/


**Server URL:**  https://let-s-travel-website-server.vercel.app/


---

## 🎯 Project Purpose

The purpose of Let'sTravel is to provide a complete and user-friendly travel ticket booking experience.

Users can search available tickets, view ticket details, select actual seats or cabins, request bookings, make payments, and download their travel tickets.

Vendors can add and manage tickets, handle booking requests, and monitor revenue.

Admins can manage users, approve or reject tickets, control advertisements, and identify fraudulent vendors.

---

## ⭐ Key Features

### 🔐 Authentication

- Email and password registration
- Email and password login
- Google Login
- Better Auth integration
- Protected routes
- Role-based authorization
- User, Vendor, and Admin roles

---

### 🏠 Homepage

- Responsive Navbar
- Hero section
- Travel search
- Bus, Plane, Train, and Cruise categories
- Advertisement section
- Latest tickets
- Popular travel routes
- Footer
- Dark and Light mode

---

### 🔎 Ticket Search & Discovery

Users can:

- Search tickets by Leaving From
- Search tickets by Going To
- Browse all tickets
- Filter tickets
- Sort tickets by price
- Browse tickets by transport category
- Use pagination
- View only Admin-approved tickets

---

### 🎟️ Ticket Details

Ticket details include:

- Ticket title
- Transport image
- From and To locations
- Transport type
- Departure date and time
- Ticket price
- Available quantity
- Perks
- Description
- Live departure countdown
- Seat or cabin selection

---

## 💺 Dynamic Seat & Cabin System

One of the main special features of Let'sTravel is its transport-specific booking system.

### 🚌 Bus

Supports:

- High Deck
- Low Deck
- Double Decker
- 2 + 2 seating
- 2 + 1 Business seating
- Sleeper layout

### ✈️ Plane

Supports:

- 3 + 3 seating
- 2 + 2 seating
- Business rows
- Economy rows
- Exit rows
- Window seats
- Middle seats
- Aisle seats

### 🚆 Train

Supports:

- Multiple coaches
- 2 + 2 seating
- 2 + 1 seating
- Berth / Sleeper
- Shovon Chair
- Snigdha
- AC Seat
- AC Berth

### 🚢 Cruise / Launch

Supports:

- Single Cabin
- Double Cabin
- Family Cabin
- Chair Seat
- Deck Seat

---

## 🟢 Live Seat Availability

Seats or cabins can have different states:

- Available
- Selected
- Reserved
- Booked

Users can select actual seats before submitting a booking request.

---

## 🔢 Automatic Ticket Quantity

Ticket quantity is automatically calculated from the selected transport layout.

Example:

```text
Bus Layout: 2 + 2
Rows: 10

Total Generated Seats: 40
```

Vendors do not need to calculate seat quantity manually.

---

## 🖼️ Live Transport Image Preview

While adding a ticket, Vendors can:

- Upload an image using ImgBB
- Paste an image URL
- Preview the image before submission
- Detect invalid image URLs
- Confirm the correct transport image before adding the ticket

Example workflow:

```text
Image Upload / Image URL
          ↓
     Live Preview
          ↓
   Vendor Verification
          ↓
     Submit Ticket
```

---

## 👤 User Dashboard

Users can:

- View Profile
- Add or Change Profile Photo
- Remove Profile Photo
- View My Booked Tickets
- Cancel Pending bookings
- Pay for Accepted bookings
- View Transaction History
- Download PDF tickets

---

## 🧑 Smart Profile Avatar

If no custom profile image is available, the system automatically generates initials from the user's name.

Examples:

```text
Let'sTravel Admin  → LA
Let'sTravel Vendor → LV
Rahim Uddin        → RU
Ikhtara Prom       → IP
```

Users can also:

```text
Add Photo
Change Photo
Remove Photo
```

If the custom photo is removed, the system automatically returns to the initials avatar.

---

## 🧑‍💼 Vendor Dashboard

Vendors can:

- View Profile
- Add Ticket
- Configure transport-specific seat layouts
- Preview images before ticket submission
- View My Added Tickets
- Update Ticket
- Delete Ticket
- View Requested Bookings
- Accept bookings
- Reject bookings
- View Revenue Overview
- View Monthly Revenue Chart

---

## 🛡️ Admin Dashboard

Admins can:

- Manage Users
- Manage Tickets
- Approve Tickets
- Reject Tickets
- Promote Users to Vendors
- Promote Users to Admins
- Mark Vendors as Fraud
- Advertise Tickets
- Unadvertise Tickets
- Control a maximum of 6 advertised tickets

---

## 💳 Stripe Payment

Let'sTravel uses Stripe Checkout for ticket payments.

The application uses:

```text
BDT - Bangladeshi Taka
```

Examples:

```text
৳1,200
৳7,200
৳48,800
```

Users can pay for a booking after the Vendor accepts the booking request.

---

## 📄 PDF Ticket Download

After successful payment, users can download a printable PDF ticket containing information such as:

- Passenger name
- Passenger email
- Ticket title
- From and To
- Seat or Cabin number
- Departure date
- Quantity
- Total amount
- Transaction ID
- Booking ID
- Payment status

---

## 📊 Vendor Revenue Analytics

Vendor Revenue Overview contains:

- Total Tickets Added
- Total Tickets Sold
- Total Revenue
- Monthly Revenue Chart

Revenue is displayed in Bangladeshi Taka.

Example:

```text
Tickets Added: 15
Tickets Sold: 6
Total Revenue: ৳48,800
```

---

## 🎨 UI / UX Specialities

The application focuses strongly on UI and UX.

Specialities include:

- Modern travel-focused interface
- Consistent Let'sTravel branding
- Responsive design
- Mobile-friendly layouts
- Tablet-friendly layouts
- Dark and Light theme
- Clear visual hierarchy
- Consistent typography
- Reusable ticket cards
- Visual seat selection
- Dynamic transport forms
- Live image preview
- Loading states
- Success and error toast messages
- Smart button states
- Modern profile design
- Easy booking workflow
- Responsive dashboards
- Responsive charts and tables
- Clear booking status indicators
- User-friendly seat availability visualization
- Consistent form styling
- Responsive Navbar and Footer
- Clean spacing and card-based layouts

---

## 🌟 Unique Features

Some of the special features implemented in this project are:

- Transport-specific seat planning
- Real seat and cabin selection
- Live seat availability
- Automatic seat quantity generation
- Automatic seat release after rejected or cancelled booking
- Live image URL preview before ticket submission
- ImgBB image upload
- Name-based smart profile avatar
- Optional custom profile photo
- Stripe BDT payment
- PDF ticket download
- Vendor revenue analytics
- Fraud Vendor protection
- Admin advertisement management
- Live departure countdown
- Dark and Light theme
- Role-based dashboard
- Dynamic transport-specific forms
- Booking status-based actions
- Responsive UI for multiple devices

---

## 🚍 Transport-Specific Booking Experience

Let'sTravel does not use the same booking layout for every transport.

Instead, every transport has its own realistic configuration.

### Bus

```text
Bus Type
→ HD / LD / DD

Seat Layout
→ 2 + 2
→ 2 + 1 Business
→ Sleeper
```

### Plane

```text
Aircraft Layout
→ 3 + 3
→ 2 + 2

Additional Configuration
→ Business Rows
→ Economy Rows
→ Exit Rows
→ Window / Middle / Aisle
```

### Train

```text
Train Layout
→ Multiple Coaches
→ 2 + 2
→ 2 + 1
→ Berth

Classes
→ Shovon Chair
→ Snigdha
→ AC Seat
→ AC Berth
```

### Cruise / Launch

```text
Single Cabin
Double Cabin
Family Cabin
Chair Seat
Deck Seat
```

---

## 🔄 Booking Workflow

The complete booking flow is:

```text
Search Ticket
      ↓
View Ticket Details
      ↓
Select Seat / Cabin
      ↓
Submit Booking Request
      ↓
Vendor Reviews Request
      ↓
Vendor Accepts
      ↓
User Pays with Stripe
      ↓
Payment Successful
      ↓
Transaction Created
      ↓
Ticket Marked Paid
      ↓
Download PDF Ticket
```

---

## ♻️ Automatic Seat Release

If a booking remains Pending and is cancelled by the User:

```text
Pending
   ↓
Cancelled
   ↓
Seat Available Again
```

If a Vendor rejects a Pending booking:

```text
Pending
   ↓
Rejected
   ↓
Seat Available Again
```

This helps prevent unavailable seats from remaining unnecessarily reserved.

---

## 🎯 Smart Booking Actions

Booking buttons automatically change according to booking status.

Example:

```text
Pending
→ Cancel Booking

Accepted
→ Pay Now

Rejected
→ No Payment Available

Paid
→ Payment Completed
```

The system also prevents inappropriate actions after the departure time.

---

## 🚨 Fraud Vendor Protection

Admins can mark a Vendor as Fraud.

When a Vendor is marked as Fraud:

```text
Vendor
   ↓
Marked as Fraud
   ↓
Vendor Tickets Hidden
   ↓
Advertisements Removed
   ↓
Vendor Restricted
```

This helps protect the platform from suspicious Vendors.

---

## 📢 Advertisement Management

Admins can advertise approved tickets on the homepage.

Features include:

- Advertise approved ticket
- Unadvertise ticket
- Display advertised tickets on homepage
- Maximum 6 advertised tickets

---

## 🛠️ Technologies Used

- Next.js
- React
- JavaScript
- JSX
- CSS
- MongoDB
- Better Auth
- HeroUI
- Stripe
- ImgBB
- Recharts
- jsPDF

---

## 📦 NPM Packages Used

Major npm packages used in the project:

```text
next
react
react-dom
better-auth
@better-auth/mongo-adapter
mongodb
@heroui/react
@heroui/styles
lucide-react
react-icons
react-hot-toast
recharts
jspdf
@teispace/next-themes
```

For the exact installed package versions, check:

```text
package.json
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone YOUR_CLIENT_GITHUB_REPOSITORY
```

### 2. Go to the project folder

```bash
cd YOUR_PROJECT_FOLDER
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api

NEXT_PUBLIC_APP_URL=http://localhost:3000

BETTER_AUTH_URL=http://localhost:3000

BETTER_AUTH_SECRET=YOUR_BETTER_AUTH_SECRET

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING

DB_NAME=YOUR_DATABASE_NAME

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID

GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

NEXT_PUBLIC_IMGBB_API_KEY=YOUR_IMGBB_API_KEY
```

> Never upload `.env.local` or secret credentials to GitHub.

---

## 📁 Important Project Structure

```text
src/
│
├── app/
│   ├── bus/
│   ├── plane/
│   ├── train/
│   ├── cruise/
│   ├── tickets/
│   ├── login/
│   ├── register/
│   └── dashboard/
│       ├── add-ticket/
│       ├── advertise/
│       ├── bookings/
│       ├── manage-tickets/
│       ├── manage-users/
│       ├── my-tickets/
│       ├── profile/
│       ├── requests/
│       ├── revenue/
│       └── transactions/
│
├── components/
│   ├── AuthShell.jsx
│   ├── BrandLogo.jsx
│   ├── Countdown.jsx
│   ├── DashboardShell.jsx
│   ├── Footer.jsx
│   ├── HeroSlider.jsx
│   ├── HomePage.jsx
│   ├── ModeExplorer.jsx
│   ├── Navbar.jsx
│   ├── ProfileAvatar.jsx
│   ├── SeatMap.jsx
│   ├── SectionTitle.jsx
│   ├── SessionSync.jsx
│   ├── ThemeToggle.jsx
│   ├── TicketCard.jsx
│   ├── TravelModePage.jsx
│   └── UserAvatar.jsx
│
└── lib/
    ├── api.js
    ├── auth-client.js
    ├── auth.js
    └── receipt.js
```

---

## 🔗 Repository Links

**Client Repository:**  
YOUR_CLIENT_GITHUB_REPOSITORY

**Server Repository:**  
YOUR_SERVER_GITHUB_REPOSITORY

---

## 🔑 Demo Credentials

### Admin

```text
Email: YOUR_ADMIN_EMAIL
Password: YOUR_ADMIN_PASSWORD
```

### Vendor

```text
Email: YOUR_VENDOR_EMAIL
Password: YOUR_VENDOR_PASSWORD
```

---

## 🧪 Stripe Test Payment

For Stripe Test Mode, you can use:

```text
Card Number:
4242 4242 4242 4242

Expiry:
Any future date

CVC:
123
```

No real money is charged in Stripe Test Mode.

---

## ✅ Major Functionalities

```text
✅ Email/Password Authentication
✅ Google Authentication
✅ User/Vendor/Admin Roles
✅ Protected Routes
✅ Homepage
✅ Bus Category
✅ Plane Category
✅ Train Category
✅ Cruise/Launch Category
✅ All Tickets
✅ Search
✅ Filter
✅ Sort
✅ Pagination
✅ Ticket Details
✅ Countdown
✅ Dynamic Seat Map
✅ Real Seat Selection
✅ Booking System
✅ Booking Cancellation
✅ Vendor Booking Approval
✅ Stripe Payment
✅ BDT Currency
✅ Transaction History
✅ PDF Ticket
✅ Vendor Revenue Analytics
✅ Admin Ticket Approval
✅ Admin User Management
✅ Fraud Vendor Protection
✅ Advertisement Management
✅ Live Image Preview
✅ ImgBB Upload
✅ Profile Photo
✅ Smart Initial Avatar
✅ Dark Mode
✅ Light Mode
✅ Responsive UI
```

---

## 👨‍💻 Project Information

**Project Name:** Let'sTravel

**Project Type:** Online Ticket Booking Platform

**Frontend:** Next.js + React

**Language:** JavaScript / JSX

**Backend:** Express.js + MongoDB

**Authentication:** Better Auth

**Payment:** Stripe

**Currency:** Bangladeshi Taka (BDT)

---

## ⭐ What Makes Let'sTravel Different?

Let'sTravel is more than a basic CRUD ticket booking application.

It combines:

```text
Modern UI/UX
+
Multi-role Authentication
+
Bus / Plane / Train / Cruise Booking
+
Transport-Specific Seat Layouts
+
Real Seat Selection
+
Live Seat Availability
+
Live Image Preview
+
Automatic Quantity Generation
+
Automatic Seat Release
+
Vendor Booking Approval
+
Stripe BDT Payment
+
PDF Ticket Download
+
Revenue Analytics
+
Admin Moderation
+
Fraud Protection
+
Responsive Dark / Light UI
```

into one complete travel ticket booking experience.

---

## 🚀 Before Submission

Replace the following placeholders with your real information:

```text
YOUR_LIVE_SITE_URL
YOUR_SERVER_LIVE_URL
YOUR_CLIENT_GITHUB_REPOSITORY
YOUR_SERVER_GITHUB_REPOSITORY
YOUR_PROJECT_FOLDER
YOUR_ADMIN_EMAIL
YOUR_ADMIN_PASSWORD
YOUR_VENDOR_EMAIL
YOUR_VENDOR_PASSWORD
```

Do not expose:

```text
MongoDB Password
BETTER_AUTH_SECRET
Google Client Secret
Stripe Secret Key
ImgBB Private Credentials
```

---

## 📌 Required README Information Covered

This README includes all major required documentation:

```text
✅ Project Name
✅ Project Purpose
✅ Live URL
✅ Key Features
✅ NPM Packages Used
✅ Installation Instructions
✅ Environment Variable Guidelines
✅ Authentication Information
✅ Role Details
✅ Unique Features
✅ UI/UX Specialities
✅ Repository Links
✅ Demo Credentials
```

---

## 👨‍💻 Author

Developed for the **Online Ticket Booking Platform** project.

**Project Name:** Let'sTravel
