import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
});

export async function executeQuery({ query, values = [] }) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    throw error;
  }
}


export async function executeDynamicQuery({ query, values = [] }) {
  try {
  
    const timestamp = Date.now();
    if (query.includes('SELECT')) {
      query = `${query} /* timestamp: ${timestamp} */`;
    }
    
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    throw error;
  }
}

export default { executeQuery, executeDynamicQuery };