Rug: The Somali National PUDO Network
<!-- This is a placeholder for a future logo -->
Rug (Somali for "courier") is a digital platform designed to build a modern, reliable last-mile delivery network for the Somali Postal Service (SomPost) by creating a de facto national digital addressing system.
🚩 The Problem: An Address for Everyone
Somalia faces a unique logistical challenge: the absence of a standardized street addressing system. This makes last-mile delivery inefficient, unreliable, and nearly impossible to scale. For Somali Post, this means lost parcels, high operational costs, and an inability to compete in the growing world of e-commerce and international logistics.
💡 The Solution: Your Phone is Your Address
"Rug" solves this problem by fundamentally changing how deliveries are addressed. Instead of a street address, we use the most ubiquitous identifier in Somalia: the mobile phone number.
The system links every registered user's phone number to a physical, verified Pick-Up Drop-Off (PUDO) point—a local shop, pharmacy, or post office. This creates a simple, powerful, and scalable network.
The core workflow is simple:
A parcel for "Abdi" arrives in Somalia, addressed with his phone number: +252 612 345678.
SomPost staff look up the number in the "Rug" system.
The system shows Abdi’s chosen PUDO point: "Juba Hypermarket, Yaaqshiid District."
The parcel is routed to the Juba Hypermarket.
Abdi receives an SMS with a secure pickup code. He collects his parcel at his convenience.
✨ Key Features
The "Rug" ecosystem consists of three interconnected components:
📱 1. The Customer App (for Somali Citizens)
Simple Onboarding: Register in seconds with just a phone number and OTP verification.
PUDO Discovery: Browse an interactive map and list of all verified PUDO points.
Digital Address Linking: Select a convenient PUDO as your official delivery location.
Real-Time Tracking: View the status of all your incoming parcels in one dashboard.
Secure Notifications: Receive instant SMS and push notifications with a unique pickup code when your parcel is ready.
📦 2. The PUDO Employee App (for PUDO Partners)
Fast Parcel Check-In: Scan a parcel's barcode using a phone camera to log its arrival.
Automated Notifications: Checking in a parcel automatically triggers the pickup notification to the customer.
Secure Verification: Verify a customer's identity by entering their unique pickup code.
Offline Capability: A "Store-and-Forward" mechanism ensures the app works even in areas with unstable internet connectivity.
🌐 3. The SomPost Admin Portal (for Management)
Centralized PUDO Management: Approve, manage, and monitor all PUDO locations in the network.
Operational Analytics: A powerful dashboard to track parcel volume, delivery times, and PUDO performance.
User & Parcel Support: Look up user accounts and track parcels to resolve customer issues quickly.
Logistics Planning: Use data to optimize delivery routes and identify areas for network expansion.
🏗️ System Architecture
The platform is designed as a modern, scalable, API-first system.
code
Code
+------------------------+      +-------------------------+      +---------------------------+
|                        |      |                         |      |                           |
|  Customer Mobile App   |      |   PUDO Employee App     |      |   SomPost Admin Portal    |
| (iOS / Android)        |      |       (PWA)             |      |         (Web)             |
|                        |      |                         |      |                           |
+-----------+------------+      +------------+------------+      +-------------+-------------+
            |                              |                                  |
            |              +---------------+----------------+                 |
            +------------> |                                | <---------------+
                           |        "Rug" Core API          |
                           |       (Backend Logic)          |
            <------------+ |                                | +-------------->
                           +----------------+---------------+
                                            |
                               +------------+------------+
                               |                         |
                               |    Database & Cloud     |
                               |      Infrastructure     |
                               |                         |
                               +-------------------------+
🛠️ Proposed Technology Stack
Backend: Node.js (Express.js) / Python (Django / FastAPI)
Database: PostgreSQL
Customer App: React Native (for cross-platform iOS & Android support)
PUDO Employee App: Progressive Web App (PWA) built with React or Vue.js for maximum device compatibility.
Admin Portal: React or Vue.js
Deployment: Docker, hosted on AWS, Azure, or Google Cloud
Key Integrations: Twilio (SMS Gateway), OpenStreetMap/Google Maps API
🚀 Project Status & Roadmap
This project is currently in the product definition and design phase. The next steps are:
[Next] UI/UX Design: Create wireframes, mockups, and prototypes for all three components.
Backend Development: Build the core API, database schema, and business logic.
Frontend Development: Develop the Customer App, PUDO App, and Admin Portal.
Pilot Program: Launch a pilot with a limited number of PUDO points in a specific region.
National Rollout: Scale the system across the country.
🤝 Contributing
We are looking for collaborators, partners, and developers who are passionate about building transformative infrastructure in Somalia. If you are interested in contributing to the "Rug" project, please reach out.
📜 License
This project concept is shared under the MIT License. See the LICENSE file for details.