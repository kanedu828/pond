import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { randomBytes } from 'crypto';
import PondUserController from '../controller/pondUserController';

const POND_WEB_URL = process.env.POND_WEB_URL ?? '';
const isProduction = process.env.NODE_ENV === 'production';

const getAuthenticationRouter = (pondUserController: PondUserController) => {
	const router: any = Router();

	router.post('/guest-login', (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate('cookie', (err: any, user: Express.User, info: any) => {
			if (err) {
				console.error('Authentication error:', err);
				return res.status(500).json({ message: 'Internal server error' });
				}
				if (!user) {
				console.warn('Authentication failed:', info);
				return res.status(401).json({ message: 'Authentication failed' });
				}
				req.logIn(user, (loginErr) => {
				if (loginErr) {
					console.error('Login error:', loginErr);
					return res.status(500).json({ message: 'Internal server error' });
				}
				return res.json({ message: 'Logged in as an user' });
		  });
		})(req, res, next);
	  });
	
	router.post('/login', (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate('local', (err: any, user: Express.User, info: any) => {

		if (err) {
			console.error('Authentication error:', err);
			return res.status(500).json({ message: 'Internal server error', incorrectCredentials: false });
		  }
		  if (!user) {
			console.warn('Authentication failed:', info);
			return res.status(401).json({ message: 'Incorrect username or password', incorrectCredentials: true });
		  }
		  req.logIn(user, (loginErr) => {
			if (loginErr) {
			  console.error('Login error:', loginErr);
			  return res.status(500).json({ message: 'Internal server error', incorrectCredentials: false });
			}
			return res.json({ message: 'Success', incorrectCredentials: false });
		});
	})(req, res, next);
	});
	
	router.post('/register', pondUserController.registerUserLocal.bind(pondUserController));

	router.get('/set-cookie', (req: Request, res: Response) => {
		const name = 'pondAuthToken';
		let value = req.cookies[name]; // Get the existing cookie value

		if (!value) {
		  // Generate a new value if the cookie doesn't exist
		  value = randomBytes(48).toString('hex');
		}
	
	
		const date = new Date();
		date.setFullYear(date.getFullYear() + 30);

		const domain = isProduction ? POND_WEB_URL.replace(/^https?:\/\//, '.') : POND_WEB_URL.replace(/:\d+$/, '').replace(/^https?:\/\//, '');
		// Update the cookie with HttpOnly and other attributes
		res.cookie(name, value, {
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
