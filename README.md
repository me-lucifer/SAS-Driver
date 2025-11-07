# SAS Fleet Driver App

This is a web application built to serve as a mobile-first tool for drivers in the SAS Fleet management system. The primary function of this app is to allow drivers to capture and submit their vehicle's daily odometer readings in a simple and reliable manner, even when offline.

## Key Features

- **Authentication**: Secure login for drivers using email and password.
- **Vehicle Identification**: Drivers can link their session to a vehicle by scanning a QR code, using OCR to capture the license plate, or entering it manually. The last used vehicle is saved for quick access.
- **Odometer Capture**: A guided, multi-step process for submitting readings:
    - **Photo Capture**: Take a picture of the vehicle's odometer.
    - **OCR & Review**: The app performs OCR on the image, and the driver can review and correct the reading if needed.
    - **Submission Review**: A final summary screen allows the driver to confirm all details before submitting.
- **Submission History**: Drivers can view a list of their past submissions.
    - **Filtering**: Submissions can be filtered by date, vehicle plate, and status (e.g., `Verified`, `Submitted`, `Flagged`).
- **Submission Details**: A detailed view for each submission shows a complete summary, the captured photo, notes, and a timeline of status changes.
- **Offline Support**: The app is designed to work offline. Submissions made without an internet connection are saved locally and automatically synced once the connection is restored.
- **User Profile & Settings**: A slide-out drawer provides access to driver information, help sections (like capture tips), and the logout function.

## Tech Stack

This project is built with a modern, component-based architecture.

- **Framework**: [Next.js](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend Services**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) (for features like OCR)
