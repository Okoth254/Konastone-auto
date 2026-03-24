# Konastone Autos - Project Brief & Functionalities

This document outlines the core working functionalities and features of the Konastone Autos web application.

## 1. Core Web Application Pages

### Home Page (`/`)
The main landing page designed to capture user interest and provide quick access to inventory.
*   **Hero Section & Search:** Features a prominent hero image and a dynamic `HeroSearchForm` allowing users to quickly search for vehicles by Make, Model, or other criteria.
*   **Browse By Brand:** A visually curated section displaying logos of premium automotive brands (Toyota, Mercedes-Benz, BMW, etc.). Clicking a brand filters the inventory page directly for that specific make.
*   **Featured Listings:** Dynamic grid displaying premium, hand-picked vehicles ready for immediate delivery or "In Transit". Highlights key specs (mileage, fuel, transmission, price) and includes a direct "Inquire on WhatsApp" action button.
*   **Dealership Stats & Value Propositions:** Abstracted metrics and "Why Choose Konastone" sections to build trust (Competitive Prices, Fast Payment, Quality Assured, Expert Support).

### Inventory Page (`/inventory`)
The comprehensive catalog of all available vehicles.
*   **Dynamic Filtering:** An advanced `InventorySidebar` allowing users to filter the vehicle list by:
    *   **Status:** All, New Arrivals, Foreign/Local, In Transit.
    *   **Make & Model:** Text-based search or selection.
    *   **Year Range:** Min and Max year sliders/inputs.
    *   **Price Range:** Maximum price limits.
*   **Vehicle Grid:** Displays the filtered list of cars. Visual badges indicate if a car is a "New Arrival" or "In Transit" (with ETA).
*   **Quick Specs overview:** Shows mileage, fuel type, transmission, color, and price upfront, with a "View Details" button to see more.

### Vehicle Details Page (`/vehicle/[id]`)
The dedicated page for a single vehicle listing.
*   **Image Gallery:** Uses the `ImageGallery` component to display multiple high-quality photos of the vehicle's exterior and interior.
*   **Comprehensive Specs:** Detailed breakdown of the car's specifications and features.
*   **Interactive Finance Calculator:** The `FinanceCalculator` component allows users to input down payments and loan terms to estimate their monthly installments dynamically based on current dealership interest rates.
*   **Lead Generation Form:** The `LeadForm` provides a direct way for users to request more information, schedule a viewing, or express interest in purchasing the specific vehicle.

### Supporting Pages
*   **About Us (`/about`):** Information regarding Konastone Autos\' history, mission, and team.
*   **Reviews (`/reviews`):** Customer testimonials and ratings to establish social proof.

## 2. Technical Capabilities & Integrations
*   **Supabase Backend:** The application retrieves vehicle data dynamically from a Supabase PostgreSQL database. Featured vehicles and inventory lists are pulled in real-time.
*   **Responsive Design:** Fully responsive layout utilizing Tailwind CSS, ensuring optimal viewing experiences across desktop, tablet, and mobile devices.
*   **SEO Optimization:** Programmatic sitemap generation (`sitemap.ts`) and dynamic metadata configuration for robust search engine visibility.
*   **Centralized Configuration:** Site-wide settings (contact info, finance rates, dealership stats) are managed centrally in a `siteConfig` object for easy maintenance and global updates.

## 3. End-to-End User Journey: Finding and Inquiring About a Vehicle

This outlines the complete workflow a prospective buyer takes from landing on the website to initiating a purchase or inquiry.

### Step 1: Discovery & Entry
*   **Landing:** The user arrives at the home page (`/`).
*   **Initial Engagement:** The user is presented with high-quality imagery and the value propositions of the dealership. They can choose to:
    *   Click a specific brand logo in the **"Browse by Brand"** section (e.g., clicking the Mercedes logo).
    *   Use the **Hero Search Form** to manually select a Make, Model, and max price.
    *   Click on a specific car that catches their eye in the **"Featured Listings"** grid.
    *   Click "View All Inventory" to see the full catalog.

### Step 2: Browsing & Filtering (`/inventory`)
*   **Arrival at Catalog:** If the user didn't click a specific featured car, they arrive at the `/inventory` page, potentially pre-filtered (e.g., only showing Mercedes vehicles).
*   **Refining the Search:** The user interacts with the dynamic `InventorySidebar` on the left.
    *   They might adjust the **Price slide/input** to match their budget.
    *   They might specify a **Year range** (e.g., 2018 - 2024).
    *   They can toggle vehicle **Status** (e.g., looking specifically for "New Arrivals" or cars currently "In Transit").
*   **Results Evaluation:** The grid updates instantly. The user scans the quick specs (mileage, transmission, fuel, price) on the vehicle cards. Badges like "In Transit" (with ETA) or "New Arrival" help them prioritize.

### Step 3: Detailed Vehicle Evaluation (`/vehicle/[id]`)
*   **Selection:** The user finds a promising vehicle and clicks **"View Details"**.
*   **Visual Inspection:** On the vehicle detail page, the user browses through the `ImageGallery`, viewing high-resolution exterior and interior shots.
*   **Feature Verification:** They review the "Technical Specifications" table (checking Drive Type, exact Body Type) and the "Premium Features" list to ensure the car meets their needs.
*   **Decision Support Actions:**
    *   **Save/Favorite:** The user might click the "Save" (heart icon) button to shortlist the vehicle for later.
    *   **Compare:** They might click "Compare" to weigh it against another car they viewed earlier.
    *   **Similar Vehicles:** If this car isn't perfect, they might scroll down to the "Similar Premium Vehicles" section and click on an alternative.

### Step 4: Financial Planning
*   **Calculating Affordability:** The user scrolls to the `FinanceCalculator`.
*   **Interaction:** They input their expected **Down Payment** (e.g., 30%) and select a desired **Loan Term** (e.g., 48 months).
*   **Result:** The calculator instantly displays the estimated monthly installment based on Konastone Autos' configured interest rates.

### Step 5: Inquiry & Conversion
*   Once convinced, the user decides to reach out to the dealership. They have multiple convenient options situated prominently on the page:
    *   **Direct WhatsApp:** They click the "WhatsApp" button, which opens their WhatsApp app with a pre-filled message specific to that exact car (e.g., *"Hi Konastone! I'm interested in the 2020 Mercedes-Benz GLC going for KES 6.50M. Is it still available?"*).
    *   **Direct Call:** They click the "Call Now" button to immediately phone the sales team.
    *   **Lead Form Submission:** They fill out the structured `LeadForm` directly on the page, providing their Name, Email, Phone number, and a custom message requesting a test drive or more details. Upon submission, the dealership receives the lead tied directly to that specific vehicle ID.
