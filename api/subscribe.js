const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  if (req.method === 'POST') {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    const dataDir = path.resolve(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'subscribers.txt');
    const emailEntry = `${new Date().toISOString()},${email}\n`;

    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.appendFileSync(filePath, emailEntry);
      res.status(200).json({ message: 'Thank you for subscribing!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
};
