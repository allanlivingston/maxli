import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

const GUEST_ID_COOKIE = 'guestId';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    let guestId = req.cookies[GUEST_ID_COOKIE];

    if (!guestId) {
      guestId = uuidv4();
      res.setHeader('Set-Cookie', `${GUEST_ID_COOKIE}=${guestId}; Path=/; HttpOnly; Max-Age=31536000; SameSite=Strict`);
    }

    res.status(200).json({ guestId });
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
