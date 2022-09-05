export default function authenticated({ next, router }) {
  let user = JSON.parse(window.localStorage.getItem('user-granados'));
  if (!user.is_admin ) {
    return router.push({ name: 'home' });
  }
  return next();
}