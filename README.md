# Simple-Reddit-Clone
This project is a reddit-ish/todo clone with session-based authentication,crud operations,follows guides to SEO optimization and many more to come.
Backend is built with node.js,express.js,typeorm,graphql,apollo server. Frontend is written with react,next.js and urql. 

# Installation
1.clone the repo
```git clone https://github.com/kalebda/Simple-Reddit-Clone.git```
2.install dependencies
```
cd server
yarn install
cd client
yarn install
```
3.create a config file and set up your database configuration and create a postgres table based on your table_name in your configuration file

# Usage
1.I am going to assume that you have redis installed.
```
cd server
redis-server
yarn watch
yarn dev
```
2.
```
cd client
yarn dev
```
This repo is inspired by Ben Awad's full stack tutorial on youtube
