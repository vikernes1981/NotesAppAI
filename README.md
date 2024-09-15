# NotesAppAI

- Clone into your computer
- `cd` into working directory
- `npm i` to install dependencies
- create a `.env.development.local` file with three variables:
  - `VITE_GEN_AI_API_KEY='your private token'`
  - `VITE_NOTES_API=http://localhost:8080` assuming your backend API is running on port 8080
  - `VITE_PROXY_OPENAI=http://localhost:5050` assuming your Open AI proxy API is running on port 5050
- The server defaults to port `5173`, although you can override this in the script sections in `package.json`

## Commands

- `npm run dev`: Starts development server, pulling environment variables from `.env.development.local` file
- `npm run build`: Build app with enviroment set to `.env.production.local`
- `npm start`: Production server
