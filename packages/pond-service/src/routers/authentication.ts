import { Router, Request, Response } from 'express';
import passport from 'passport';

const POND_WEB_URL = process.env.POND_WEB_URL ?? '';
const isProduction = process.env.NODE_ENV === 'production';

const getAuthenticationRouter = () => {
	const router: any = Router();

	router.post('/guest-login', passport.authenticate('cookie', {}));

	router.get('/set-cookie', (req: Request, res: Response) => {
		

		const name = 'pondAuthToken';
		const existingValue = req.cookies[name]; // Get the existing cookie value
	
		if (!existingValue) {
		  return res.status(400).send('Cookie not found');
		}
	
		const days = 30;
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

		const domain = isProduction ? POND_WEB_URL : '127.0.0.1';
		console.log(domain)
		// Update the cookie with HttpOnly and other attributes
		res.cookie(name, existingValue, {
		  expires: date,
		  httpOnly: true, // Ensures the cookie is only accessible over HTTP(S), not via JavaScript
		  secure: isProduction, // Secure cookies in production
		  domain: domain, // Set the domain to the parent domain
		  path: '/',
		});
	
		res.send('HttpOnly cookie set');
	});

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

	router.post('/logout', (req: Request, res: Response) => {
		req.session.destroy((err) => {
			if (err) {
				res.status(400).json(err);
				res.json({ success: false });
			}
		});
		req.logout((err) => {
			if (err) {
				res.status(400).json(err);
			}
		});
		res.status(200).json({});
	});

	router.get('/status', (req: Request, res: Response) => {
		if (req.user) {
			res.json({ authenticated: true });
		} else {
			res.json({ authenticated: false });
		}
	});

	return router;
};

export default getAuthenticationRouter;
