<!-- omit in toc -->
# [mgr-api](https://mgrserver.herokuapp.com/)

<!-- omit in toc -->
## Table of Contents
- [Description](#description)
- [User Story](#user-story)
- [Usage](#usage)
- [Installation](#installation)
- [Credits](#credits)
- [Deployed Site](#deployed-site)
- [Developers](#developers)

## Description
MGR is an application that helps managers and artists track deadlines and social media commitments with shared calendars and cloud-based file sharing. Our goal is to automate the process of communicating important dates, managing social media schedules, and sharing content necessary for artist promotion in a simple & seamless experience.

## User Story
<strong>Manager/Record Label Rep</strong> <br>
AS AN artist manager/record label representative <br>
I WANT to be able to set release dates, social media scheduling deadlines, and share content <br>
SO THAT I can easily manage commitments for my artists and keep all content in one place to be easily accessible so that artists can post on their social media platforms by a given deadline

<strong>Artist</strong> <br>
AS AN artist <br>
I WANT to be able to check a calendar for upcoming music release dates and social media/promotion deadlines and quickly access the content I need <br>
SO THAT I can easily track timelines for release dates and promotional activities and easily send out social media posts 

## Usage
These are the API routes for the client website https://mgr-talent.herokuapp.com/ . To view the routes locally, add the route names found in the routes folder to `localhost:8080`. To view the routes on the deployed site, add the routes names to https://mgrserver.herokuapp.com/ . 

## Installation
The app can be used through the deployed site above, but if you want to clone the repo, the application requires Node.js and MongoDB to be installed. 
1. Check if Node.js is installed by entering `node --version` into the command line. If it is installed, a version number should be displayed. 
   - If not, it can be [downloaded from their website](https://nodejs.org/en/download/), then check if it was installed properly by performing `node --version` 
2. If the command `mongod` or `mongo` is not recognised in the command line, MongoDB has not been installed. [Follow the guides here for your OS](https://docs.mongodb.com/manual/installation/)
3. Run `npm install` in the command line from the root directory of the project to install all dependencies
4. To run locally, run `node server` in the command line from the root directory of the project and then open your browser to `localhost:8080` and enter the route names found in the routes folder.
    - To test with client side, clone the [client repo](https://github.com/sali6798/mgr-react/), run `npm install` (in a different command line different to the one currently running this API project) in the root directory of the client project. Then run `npm start` which should automatically open your browser to `localhost:3000`, if not, open it manually in your browser.

## Credits
- [Axios](https://www.npmjs.com/package/axios)
- [Node Cron](https://www.npmjs.com/package/node-cron)
- [Moment.js](https://momentjs.com/)
- [base64-img](https://www.npmjs.com/package/base64-img)
- [Nodemailer](https://www.npmjs.com/package/nodemailer)
- [Passport](https://www.npmjs.com/package/passport)
- [passport-facebook](https://www.npmjs.com/package/passport-facebook)
- [passport-twitter](https://www.npmjs.com/package/passport-twitter)
- [passport-local](https://www.npmjs.com/package/passport-local)
- [twitter](https://www.npmjs.com/package/twitter)
- [Mongoose](https://www.npmjs.com/package/mongoose)
- [cors](https://www.npmjs.com/package/cors)
- [cookie-session](https://www.npmjs.com/package/cookie-session)

## Deployed Site
- Client Side: https://mgr-talent.herokuapp.com/
- Server Side: https://mgrserver.herokuapp.com/

## Developers
- Shaidee Alingcastre ([Github](https://github.com/sali6798/), [LinkedIn](https://www.linkedin.com/in/shaidee-alingcastre/))
- Brett Belka ([Github](https://github.com/bbelka/), [LinkedIn](https://www.linkedin.com/in/brettbelka/))
- JJ Cardenas ([Github](https://github.com/cardeens), [LinkedIn](https://www.linkedin.com/in/jordanjcardenas/))
- Kridsanapong Daihentob ([Github](https://github.com/commiewalker), [LinkedIn](https://www.linkedin.com/in/kridsanapong-daihentob-9341ba152/)
