import dotenv from 'dotenv';
import path from 'path';

// Load .env from the package root or project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { app } from './index';

const port = process.env.PORT || 3031;

app.listen(port, () => {
  console.log(`ContentCommand API is running on http://localhost:${port}`);
});
