import { Router, Request, Response } from 'express';
import PondUserController from '../controller/pondUserController';
import { isLoggedIn } from '../util/middleware';

export const getUserRouter = (pondUserController: PondUserController) => {
  const router: any = Router();

  router.use(isLoggedIn);

  router.get('/', (req: Request, res: Response) => {
    res.json(req.user);
  });

  router.get('/fish', pondUserController.getUserFish.bind(pondUserController));

  router.post('/update-location/:location', pondUserController.updateUserLocation.bind(pondUserController));

  router.post('/update-username', pondUserController.updateUsername.bind(pondUserController));

  router.get('/leaderboard', pondUserController.getTopHundredPondUsersByExp.bind(pondUserController));

  return router;
};
