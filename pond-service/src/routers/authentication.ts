import { Router, Request, Response } from 'express';
import passport from 'passport';

const POND_WEB_URL = process.env.POND_WEB_URL ?? '';

const getAuthenticationRouter = () => {
  const router: any = Router();

  router.get(
    '/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account'
    })
  );

  router.get(
    '/google/callback',
    passport.authenticate('google', {
      successRedirect: POND_WEB_URL
    })
  );

  router.get('/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).json(err);
      }
    });
    req.logout((err) => {
      if (err) {
        res.status(400).json(err);
      }
    });
    res.status(200);
  });

  router.get('/good', (req: Request, res: Response) => {
    if (req.user) {
      res.json({ authenticated: true });
    } else {
      res.json({ authenticated: false });
    }
  });

  return router;
};

export default getAuthenticationRouter;
