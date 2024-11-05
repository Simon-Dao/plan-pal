//{domain}/api/event/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type EventData = {
  user?: string;
  title: string;
  date: string;
  eventDays: [],
  timezone: "",
  startTime: "",
  endTime: "",
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const eventData: EventData = req.body;
    // Process the event data, e.g., save to a database
    res.status(200).json({ message: 'Event created', data: eventData });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
