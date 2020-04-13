# WebTech-Project
## Getting Started - Noob manual API version
Steps:
1. Install Docker on your device
2. Install all the necessary dependencies to run the APIs `pip3 install flask flask_api flask_cors requests pymongo numpy pandas`
3. Install npm and nodejs
4. Run `npm start` inside the frontend directory
5. Pull mongo image from DockerHub `docker pull mongo`
6. Run docker container for mongo `docker run -p 27017:27017 mongo`
7. Inside the backend directory run:
* `python3 uac/uac.py`
* `python3 user/user.py`

## Getting Started - Docker Compose version
Steps:
1. Install Docker on your device

2. Go into `base_builder` directory `cd base_builder`

3. Build the base image `docker build -t wtbase .`

4. Go back to the parent directory

5. Build the Server images:

   ```bash
   cd ./backend/auth
   docker build -t uac .
   cd ../..
   cd ./backend/classifier
   docker build -t classifier .
   cd ../..
   cd ./backend/eda
   docker build -t eda .
   cd ../..
   cd ./backend/user
   docker build -t user .
   cd ../..
   ```

6. Build the front-end image `cd ./frontend && docker build -t frontend . && cd ..`
7. Go to the deployments folder and run the docker compose file. `cd ./deployment && docker-compose up`
8. Access the front-end at http://localhost:3000/