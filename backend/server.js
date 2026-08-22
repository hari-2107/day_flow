const express = require('express');
const cors = require('cors');

const app = express();

// Allow requests from React frontend
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());