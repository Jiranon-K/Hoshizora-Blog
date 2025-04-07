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


// WARNING: This function should be used with extreme caution as it could be vulnerable to SQL injection
// Always prefer executeQuery with parameterized queries where possible
export async function executeDynamicQuery({ query, values = [] }) {
  try {
    // Add safety checks to prevent dangerous SQL operations from being executed dynamically
    const lowerQuery = query.toLowerCase();
    
    // Block potentially harmful operations
    const blockedPatterns = [
      /drop\s+table/i,
      /drop\s+database/i,
      /truncate\s+table/i,
      /alter\s+table.*add/i,
      /alter\s+table.*drop/i,
      /into\s+outfile/i,
      /load\s+data\s+infile/i,
      /grant\s+/i,
      /information_schema/i
    ];
    
    for (const pattern of blockedPatterns) {
      if (pattern.test(lowerQuery)) {
        throw new Error('Potentially harmful SQL operation blocked');
      }
    }
    
    // Add timestamp comment for query tracing
    const timestamp = Date.now();
    if (lowerQuery.includes('select')) {
      query = `${query} /* timestamp: ${timestamp} */`;
    }
    
    // Use parameterized query to avoid SQL injection
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    throw error;
  }
}

export default { executeQuery, executeDynamicQuery };