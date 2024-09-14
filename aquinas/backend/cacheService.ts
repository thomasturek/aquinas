import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

async function connect() {
  await client.connect();
}

connect();

export async function cacheData(key: string, data: any, expirationInSeconds: number) {
  await client.set(key, JSON.stringify(data), {
    EX: expirationInSeconds
  });
}

export async function getCachedData(key: string) {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
}