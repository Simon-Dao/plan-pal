//{domain}/api/event/list.ts
import type { NextApiRequest, NextApiResponse } from 'next';

//TODO - improve security of this route
type EventData = {
  user: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const body: EventData = req.body;
    // Process the event data, e.g., save to a database
    res.status(200).json({ message: 'Here is a list of events', data: body });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
