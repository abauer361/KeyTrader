Allison Thompson & Andrew Bauer\
1847513 & (id)\
SE 330\
Project 3\
11/14/2020

### VM Setup
1. Install dependencies.
> npm install

### Progress

#### Same features of donating and redeeming keys

#### 15 points- A login system based on a username and password (instead of the discord oauth2 flow)
##### Allison 11/14/2020
* modified HTML elements of login page
* authentication research in progress
* began login form
##### Allison 11/16/2020
* finished first draft of login form frontend
* finished first draft of sign up form frontend
##### Allison 11/28/2020
* altered signup-form and login-form to handle user input
##### Allison 11/29/2020
* created routes/user.js for backend to handle signup post request, including data encryption and database insertion
* added code to auth.service.ts to handle signup email and password data
* added code to initialCreation.sql to create KeyTraderUser table
* added insert and select statements to db.js to handle KeyTraderUser table database interaction
##### Allison 11/30/2020
* completed bcrypt hashing for login and signup
* created database interaction for inserting and retrieving KeyTraderUser table items (users)
* created LoginKeyTraderUser function for authentication service
##### Allison 12/6/2020
* added in jwt to user.js for key trader authentication
* created signup-success page
* created base for communities page which login redirects to

#### 15 points- UI similar to the existing process for adding and modifying key trader communities
* refactored original front end to one container

#### 15 points- Ability to invite users to join a specific key trader community given their username (not a discord username)

#### 15 points- Ability to assign roles to users in the key trader community

### Research
##### Allison
* https://developer.okta.com/blog/2019/05/16/angular-authentication-jwt
* https://developer.okta.com/blog/2017/04/17/angular-authentication-with-oidc
* https://udemy.com/course/angular-2-and-nodejs-the-practical-guide/
* https://dzone.com/articles/tutorial-connect-your-angular-app-to-mysql
* https://www.npmjs.com/package/bcrypt

##### Andrew