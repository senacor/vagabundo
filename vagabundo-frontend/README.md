# Vagabundo Frontend

Vagabundo shows the CO2 produced by travel. 
The frontend is therefore the presentation part of the vagabundo project. Together with the backend the CO2 cost of the the persons traveling are displayed. 

# Development Setup

## General

The app is developed with angular and deployed to AWS using a Jenkins. The state management ist handled with `ngrx/store` based on the flux architecture.  

## Local setup
1) Install dependencies  
`npm install`

2) Start ng-serve  
`npm run start`

## Deployment

To deploy the frontend to AWS the Keys to access need to be set in the `etc/aws-build.json` and the corresponding endpoints within the `environments` folder

## Developer notes
The application should automatically open in a browser, but if not, go to `http://localhost:4200`

The API is versioned in `package.json` - see `config.api`  

The AWS credentials (from vagabundo-build) are stored in `etc/aws-build.json`  

see all available run-scripts  
`npm run`  

If any issues are arising regarding the login/auth, please try first in private mode.
