import { NextApiRequest, NextApiResponse } from 'next';
import logger from '~/utils/logger';

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  logger.info('Log healthy!');
  res.status(200).send('ok');
}

export default handler;
