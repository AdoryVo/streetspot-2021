# 💡 streetspot
A React Native mobile app that allows citizens to report local infrastructure issues in their area to improve their city!

*Work In Progress*

## 🚀 Getting Started
### Installation
* Download [Node.js](https://nodejs.org/en/download/).
* Download the [expo-cli](https://docs.expo.io/) package globally with `npm install -g expo-cli`.

### Initialization & Setup
1. Run `npm install` to install packages.
2. Run `expo start` to start the development server.
3. Click `Run in web browser` at the link `http://localhost:19002/`.
4. Make edits to `App.js` and the app preview should automatically update.

## ⚙️ Usage/Workflow Details
### Development Process
1. Ensure that your MongoDB server is running locally for database functionality.
2. Run `nodemon` in your terminal while testing to automatically refresh your back-end after editing.
3. Develop front-end by creating HTML pages w/ EJS in the `views` directory and editing styles in `public/styles/styles.css`.
4. Work on back-end by editing `models`, `routes`, and `index.js`.
5. (optional) Customize Bootstrap CSS in `src/custom.css` and compile it with `npm run sass` to export your bundled CSS to `public/styles/bootstrap.css`.

### Directory Details
1. The `components` directory contains custom React components.
2. The `assets` directory contains any referenced images and other files.