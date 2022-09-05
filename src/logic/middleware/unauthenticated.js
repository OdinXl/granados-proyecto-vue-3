export default function unauthenticated({ next, router }) {
    //debe existir el token y el objeto de usuario
    if (window.localStorage.getItem('auth-granados') && window.localStorage.getItem('user-granados')) {
      return router.push({ name: 'dasboard' });
    }
    return next();
}