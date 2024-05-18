import { NextFunction, Request, Response } from 'express';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as CookieStrategy } from 'passport-cookie';
import passport from 'passport';
import PondUser from '../models/pondUserModel';
import PondUserController from '../controller/pondUserController';
import { pondUserLogger } from './logger';

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
	if (req.user) {
		next();
	} else {
		pondUserLogger.error('User is not authenticated');
		next(new Error('unauthorized'));
	}
};

export const setupAuth = (pondUserController: PondUserController) => {
	// user is type any because I am getting "User does not have id property"
	// when declared as Express.User
	passport.serializeUser((user, done) => {
		const pondUser = user as PondUser;
		done(null, pondUser.id);
	});

	passport.deserializeUser(async (id: number, done) => {
		const user = await pondUserController.getPondUserById(id);
		done(null, user);
	});

	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID ?? '',
				clientSecret: process?.env?.GOOGLE_CLIENT_SECRET ?? '',
				callbackURL: `${process?.env?.POND_SERVICE_URL ?? ''}/auth/google/callback`,
				passReqToCallback: true
			},
			async (_request, _accessToken, _refreshToken, profile, done) => {
				const pondUser = await pondUserController.getOrCreateGooglePondUser(profile);
				done(null, pondUser || undefined);
			}
		)
	);

	passport.use(
		new LocalStrategy(async (username, password, done) => {
			const pondUser = await pondUserController.getAuthenticatedPondUser(username, password);
			return done(null, pondUser || undefined);
		})
	);

	passport.use(
		new CookieStrategy({ cookieName: 'pondAuthToken' }, async (token: string, done: any) => {
			const pondUser = await pondUserController.getOrCreateCookiePondUser(token);
			return done(null, pondUser || undefined);
		})
	);
};
