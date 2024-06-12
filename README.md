# Movie Application Backend

## Introduction
This project aims to develop a comprehensive movie application backend using Node.js. The backend includes various functionalities such as user authentication, viewing courses (movies), getting latest and recommended courses, reviewing courses, and managing user favorites.

## Features
- User Authentication (Signup, Login) using JSON Web Tokens (JWT)
- Fetch and display a list of available courses (movies)
- Retrieve the latest courses added to the platform
- Generate recommended courses based on user reviews and ratings
- Allow users to post comments and rate courses
- Provide detailed information about specific courses
- Allow users to like or unlike courses
- Retrieve the list of favorite courses for the logged-in user

## Getting Started

### Prerequisites
- Node.js (v12 or higher)
- npm (v6 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/ahmd-ramadan/Usamif_Task.git
    cd Usamif_Task
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Set up environment variables**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=your_port
    MONGO_URL=your_mongodb_url
    SECRET_KEY=your_jwt_secret
    GMAIL=your_gmail
    GAMIL_PASS=your_gmail_pass_for_nodemailer
    ```

4. **Start the server**
    ```bash
    npm start
    ```
    The server will start on `http://localhost:{{PORT}}`.

## API Endpoints

### User Authentication
- **Signup**
  - **Endpoint**: `POST /signup`
  - **Description**: Register a new user.
  - **Request Body**:
    ```json
    {
      "fname": "string",
      "lname": "string",
      "email": "string",
      "password": "string"
    }
    ```

- **Login**
  - **Endpoint**: `POST /login`
  - **Description**: Login a user and return a JWT token.
  - **Request Body**:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

### Courses
- **View Courses**
  - **Endpoint**: `GET /courses/list`
  - **Description**: Fetch and display a list of available courses.

- **Get Latest Courses**
  - **Endpoint**: `GET /courses/recent`
  - **Description**: Retrieve the latest courses added to the platform.

- **Get Recommended Courses**
  - **Endpoint**: `GET /courses/recommend`
  - **Description**: Generate a list of recommended courses based on user reviews and ratings.

- **Get Course Details**
  - **Endpoint**: `GET /courses/:courseId`
  - **Description**: Provide detailed information about a specific course.

### Reviews
- **Review Courses**
  - **Endpoint**: `POST /courses/review/:courseId`
  - **Description**: Allow users to post comments and rate courses.
  - **Request Body**:
    ```json
    {
      "rate": "number",
      "comment": "string"
    }
    ```

### Favorites
- **Like/Unlike Courses**
  - **Endpoint**: `get /courses/like/courseId`
  - **Description**: Allow users to like or unlike a course.

- **Get Favorite Courses**
  - **Endpoint**: `GET /api/courses/favorites`
  - **Description**: Retrieve the list of courses that the logged-in user has marked as favorites.

## Project Structure
Usamif_Task/  
├── controllers/  
│ ├── user.controller.js  
│ ├── course.controller.js  
├── models/  
│ ├── user.model.js  
│ ├── course.model.js  
│ ├── review.model.js  
├── routes/  
│ ├── auth.routes.js  
│ ├── course.routes.js  
├── middleware/  
│ ├── authentication.middleware.js  
| ├── asyncHandler.middleware.js  
├── utils/  
| ├── appError.js  
| ├── httpStatusText.js  
| ├── sendEmail.js  
├── .env  
├── server.js  
├── package.json  
└── README.md  

## Contributing
Contributions are welcome! Please create a pull request with a detailed description of your changes.

## License
This project is licensed under the MIT License.
