import { Router, Request, Response } from 'express';
import PondUserController from '../controller/pondUserController';
import { isLoggedIn } from '../util/middleware';

export const getUserRouter = (pondUserController: PondUserController) => {
  const router: any = Router();

  router.use(isLoggedIn);

  router.get('/', (req: Request, res: Response) => {
    res.json(req.user);
  });

  router.get('/fish', pondUserController.getUserFish);

  router.post('/update-location/:location', pondUserController.updateUserLocation);

  router.get('/leaderboard', pondUserController.getTopHundredPondUsersByExp);

  return router;
};
