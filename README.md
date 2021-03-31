This is a movie app where you can view movies and information about them by clicking on said movie. You can create an account to add movies to your favourites list.  
This is a single page application made using React, React Router and Redux.  
The back end uses Node and Express to send files and provide API's.  
User information is stored in MongoDB and uses Mongoose for queries to said Mongo database.  

To get the app working do the following.  

Make sure you have Node JS installed, I'm using node version 15.5.0.
Go into a terminal and CD into this folder.  
Type into the terminal "npm install" to install all the front end packages.  
Type in your terminal "npm run client-install" to install all your clients development packages.  
Create a ".env" file in the root folder, here you will provide all the environment variables.  
Then provide a number for the SERVER_PORT value for your servers port, then a anumber for your CLIENT_PORT for your front end development servers port.  
Then provide a string for your MONGO_URL that directs to a Mongo database, you can create one and connect to it online with MongoDB Atlas.  
Finally provide a signing key string to your JWT_KEY which will be used to sign tokens.  
Don't use any spaces, here is an example.  
MONGO_URL='mongodb+srv://...'  
SERVER_PORT=3000  
CLIENT_PORT=8080  
JWT_KEY='signingkeyexample'  

If you want to transpile the react code into a bundle to update the application that you'll use in production then type in the terminal "npm run client-build".  
 
To run the production build type in the terminal "npm run start" and navigate to "http://localhost:" + the SERVER_PORT value you put in the ".env" file.  
  
To run this application for development type in your terminal "npm run dev" to run the back end and client server simultaneously, a window/tab should open up automatically in your browser to show you the app.  

Todo list:  

Notes:  
If you add a none existent movie to favourites then when you log in the app will crash.  
Information is fetched synchronously so if fetching data for the movie takes too long then the comments and favourite counter won't load  