import { parseIdentityCookies } from '$lib/utils/cookies';
import { parseJwt } from '$lib/utils/helpers';


// ==============================================================================
// HANDLE
// ==============================================================================

export async function handle({ event, resolve }) {
  // console.log('=============================================================');
  // console.log(new Date().toISOString(), ': HOOKS handle');

  // parse jwt from cookie in request, if present, and populate locals.user
  const { jwt } = parseIdentityCookies(event);
  if (jwt) {
    event.locals.token = jwt;
    event.locals.user = parseJwt(jwt);
  }
  if (event.locals.user) {
    event.locals.user.authenticated = true;
  } else {
    event.locals.user = {};
    event.locals.user.authenticated = false;
  }
  
  // console.log(new Date().toISOString(), ': HOOKS handle jwt :', jwt);
  // console.log(new Date().toISOString(), ': HOOKS handle locals.user.authenticated :', event.locals.user.authenticated);

  // process requested route/endpoint
  const response = await resolve(event);

  return response

}


// ==============================================================================
// GETSESSION
// ==============================================================================

export function getSession(event) {

  // console.log('-------------------------------------------------------------');
  // console.log(new Date().toISOString(), ': HOOKS getSession');
  // console.log(new Date().toISOString(), ': HOOKS getSession locals.user.authenticated :', event.locals.user.authenticated);
  
  return {
    user: {
			authenticated: event.locals.user.authenticated || false,
			authExpires: event.locals.user.exp || null,
			email: event.locals.user.email || null,
		}
	};
}
