# ChatGPT Third-Party Client (Frontend)

This repository is a frontend application for a third-party ChatGPT client. It requires a backend server to function properly. You can find the backend repository here: [GPTbot_backend Repository](https://github.com/Aquabet/GPTbot_backend.git). It provides a user-friendly interface for interacting with OpenAI's model, allowing users to send messages, manage chat sessions, and seamlessly switch between different conversations.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Login and logout functionality for authenticated access.
- **Chat Sessions Management**: Create, rename, delete, and manage multiple chat sessions.
- **Message Interaction**: Send messages to ChatGPT and receive responses.
- **Responsive UI**: Fully responsive design for use on desktops, tablets, and mobile devices.
- **Language Toggle**: Supports switching between English and Simplified Chinese.
- **Customizable Model**: Supports customization of the model used for generating responses, allowing users to select different ChatGPT models via API.

## Technologies Used

- **React.js**: Used to build the user interface.
- **Axios**: For making HTTP requests to the backend API.
- **i18next**: For internationalization and language translation.
- **CSS Modules**: To style components in a modular and reusable way.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Demo

You can use the demo credentials to log in and explore the user interface:

- **Username**: demo
- **Password**: demo

Please note that, due to cost considerations, the demo does not support calling the API, and you will only be able to view the interface design.

### Prerequisites

- **Node.js** (v14 or above)
- **npm** (v6 or above)
- **Backend Server**: This frontend application requires a backend server to function properly. Make sure you have set up the backend server as described in its respective repository.

### Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/Aquabet/GPTbot_frontend.git
   cd GPTbot_frontend
   ```

2. **Set up the backend server**:

   Make sure to clone and set up the backend server by following the instructions in the [GPTbot_backend Repository](https://github.com/Aquabet/GPTbot_backend.git). The backend must be configured to serve the API required by this frontend, including setting up environment variables, database connections, and API endpoints as described in the backend documentation.

3. **Install frontend dependencies**:

   ```sh
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory and configure the following environment variables:

```env
VITE_ENV=development # or production

VITE_API_BASE_URL_DEVELOPMENT=http://localhost:5000/api

VITE_API_BASE_URL_PRODUCTION= https://yourdomain.com/api

VITE_BUILD_OUT_DIR=
```

- `VITE_ENV`: Specifies the current environment. Set it to development for local development or production for a production build.
- `VITE_API_BASE_URL_DEVELOPMENT`: The base URL for the backend API during development. Typically, this should point to your local backend server.
- `VITE_API_BASE_URL_PRODUCTION`: The base URL for the backend API in a production environment. You should provide the URL of your deployed backend here.
- `VITE_BUILD_OUT_DIR`: Specifies the output directory for the production build. This can be customized to fit your deployment needs, with a default value of `dist/` if left empty.

### Running the App

To start the development server, run:

```sh
npm run dev
```

The application will be available at `http://localhost:5173`.

## Usage

1. **Login**: Use your credentials to log in.
2. **Start a Conversation**: Create a new session or select an existing one from the sidebar.
3. **Send Messages**: Type your message in the input box and press enter or click "Send".
4. **Manage Sessions**: Use the sidebar to rename or delete conversations.
5. **Toggle Language**: Use the language toggle button in the header to switch between English and Chinese.
6. **Customize Model**: You can customize the model used for responses by specifying the model ID in the backend settings.

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request for review.

### Steps to Contribute

1. **Fork the repository**.
2. **Create a new branch** for your feature (`git checkout -b feature/your-feature-name`).
3. **Commit your changes** (`git commit -m 'Add some feature'`).
4. **Push to the branch** (`git push origin feature/your-feature-name`).
5. **Open a Pull Request**.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
