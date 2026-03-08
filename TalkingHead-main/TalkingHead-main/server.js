import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8000;

// Enable CORS for backend communication
app.use(cors());

// Serve static files from current directory
app.use(express.static(__dirname));

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🤖 TalkingHead Avatar server running at http://localhost:${PORT}`);
  console.log(`📡 Connected to Quantum AI Backend at http://localhost:3001`);
});
