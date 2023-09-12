import { Router, Request, Response } from 'express';
import PondUserController from '../controller/pondUserController';
import { isLoggedIn } from '../util/middleware';

const getUserRouter = (pondUserController: PondUserController) => {
  const router: any = Router();

  router.use(isLoggedIn);

  router.get('/', (req: Request, res: Response) => {
    res.json(req.user);
  });

  router.get('/fish', async (req: Request, res: Response) => {
    await pondUserController.getUserFish(req, res);
  });

  router.post('/update-location/:location', async (req: Request, res: Response) => {
    await pondUserController.updateUserLocation(req, res);
  });

  router.get('/leaderboard', async (req: Request, res: Response) => {
    await pondUserController.getTopHundredPondUsersByExp(req, res);
  });

  return router;
};

export default getUserRouter;
