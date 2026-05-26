import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'leads.json');
  const leads = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return Response.json({ leads });
}