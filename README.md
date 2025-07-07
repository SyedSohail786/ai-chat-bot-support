##  STEPS TO FOLLOW
step 1: get Google project id and dialogflow agent id
step 2: copy that 
step 3: go to backend folder/ create .env file and copy below and paste in .env
```
MONGODB_URI=mongodb://localhost:27017/ai-chat
GOOGLE_PROJECT_ID= paste your google project id
DIALOGFLOW_AGENT_ID=paste your dialogflow agent id
FRONTEND_URL=http://localhost:3000
PORT=8000

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin@123
JWT_SECRET=your_jwt_secret_key
```

and SAVE


step 4: Go to frontend/ create .env.local file and paste below
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_PROJECT_ID=your google project id
```

## To run the frontend
goto frontend and open CMD in same path,
run command "npm install" //this will install all the dependencies
run command "npm run dev"

## To run the backend  
goto backend and open CMD in same path,
run command "npm install" //this will install all the dependencies
run command "nodemon i"

### DONE
