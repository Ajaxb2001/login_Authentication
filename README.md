# Authentication Project

This project is a simple authentication system implemented using HTML, CSS, and MongoDB. It consists of the following pages:

- `index.html`: Login page.
- `signup.html`: Sign up page.
- `dashboard.html`: Dashboard page (protected).
- `logout.html`: Logout page.
- `success.html`: Success page.

## Installation

1. Clone the repository to your local machine:

```
git clone <repository-url>
```

2. Install dependencies:

```
npm install
```

3. Start the server:

```
node app.js
```

4. Open your web browser and navigate to `http://localhost:3000` to access the application.

## Dependencies

- Express.js: Used for building the server.
- Mongoose: MongoDB object modeling for Node.js.
- Express Session: Session middleware for Express.

## File Structure

```
.
├── public
│   └── images
│       └── avatar_pic.png
├── views
│   ├── dashboard.html
│   ├── index.html
│   ├── logout.html
│   ├── signup.html
│   └── success.html
├── app.js
├── package.json
└── style.css
```

## Usage

- Register a new account using the sign-up page.
- Log in with your credentials on the login page.
- Access the dashboard page after successful login.
- Log out using the logout page.

## Credits

- Icons made by [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

Feel free to customize the `README.md` file further with additional details, instructions, or any other information relevant to your project.
