# Pocket Professors

Pocket Professors is a full-stack web application that allows users to open a card pack that contains numerous hand-drawn cards of professors and people at UCF. Along with special developer cards to collect!

## Features

- User authentication (login via JWT)
- MongoDB database integration
- Simulate obtaining collectible cards
- Frontend and backend separation
- Responsive design (Web + Mobile friendly)

## Technologies Used

- **Frontend:** React, TypeScript, Vite, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT, bcrypt
- **Email:** SendGrid
- **Testing:** Jest, Supertest
- **Deployment:** Nginx (Linux), GitHub

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/jm19pa/Group25-Large-Project-COP4331.git
cd Group25-Large-Project-COP4331
```
### 2. Install packages
```bash
npm install
```
### 3. Set up Environmental Variables

create a '.env' file in the root directory. Example:
```env
MONGODB_URI=mongo_connection_string
JWT_SECRET=jwt_secret
SENDGRID_API_KEY=sendgrid_key
```
