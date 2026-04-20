import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA8TsVM19zSqGhKo4L_zMnV8acPXaVl4sA",
  databaseURL: "https://laundryapp-cd794-default-rtdb.firebaseio.com",
  projectId: "laundryapp-cd794"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
