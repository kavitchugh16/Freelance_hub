server/
└── src/
├── controllers/
│ ├── auth.controller.js # Handles login and registration [cite: 20]
│ ├── user.controller.js # Manages user profile updates [cite: 22]
│ ├── project.controller.js # Logic for posting and browsing projects [cite: 24]
│ ├── bid.controller.js # Logic for placing and viewing bids [cite: 28]
│ ├── milestone.controller.js# Logic for updating milestone status [cite: 32]
│ ├── payment.controller.js # Handles wallet and payment transactions [cite: 36]
│ └── review.controller.js # Logic for submitting reviews [cite: 44]
│
├── models/
│ ├── user.model.js # Schema for Clients and Freelancers
│ ├── project.model.js # Schema for Projects
│ ├── bid.model.js # Schema for Bids
│ ├── milestone.model.js # Schema for Milestones
│ ├── wallet.model.js # Schema for User Wallets
│ └── review.model.js # Schema for Ratings and Reviews
│
├── routes/
│ ├── auth.route.js # Routes like /api/auth/login
│ ├── user.route.js # Routes like /api/users/:id
│ ├── project.route.js # Routes like /api/projects
│ ├── bid.route.js # Routes like /api/bids
│ ├── milestone.route.js # Routes like /api/milestones/:id/update
│ └── payment.route.js # Routes for wallet transactions
│
├── middlewares/
│ └── authenticate.js # Verifies user tokens for protected routes
│
└── server.js # Main server entry file

    client/

└── src/
├── components/
│ ├── common/
│ │ ├── Navbar.jsx # Main site navigation
│ │ ├── Footer.jsx # Site footer
│ │ └── Loader.jsx # Loading spinner
│ ├── projects/
│ │ ├── ProjectCard.jsx # Displays a single project in a list
│ │ ├── ProjectFilter.jsx # Search and filter options [cite: 26]
│ │ └── BidCard.jsx # Displays a single bid on a project
│ ├── dashboard/
│ │ ├── MilestoneItem.jsx # Component to show one milestone [cite: 32]
│ │ └── ChatWindow.jsx # The chat interface [cite: 41]
│
├── pages/
│ ├── Home.jsx # Landing page
│ ├── BrowseProjects.jsx # Page for freelancers to find projects [cite: 26]
│ ├── ProjectDetails.jsx # Detailed view of a single project
│ ├── Login.jsx # User login page [cite: 21]
│ ├── Register.jsx # User registration page [cite: 21]
│ ├── ClientDashboard.jsx # Client's main hub to manage projects
│ ├── FreelancerDashboard.jsx# Freelancer's main hub
│ ├── Wallet.jsx # Page to manage funds and see transactions [cite: 36]
│ └── NotFound.jsx
│
├── services/
│ └── api.js # Central file for all backend API calls
│
├── App.jsx # Main application component with routing
└── main.jsx # Entry point of the React app
