export default defineNuxtRouteMiddleware((to) => {
  const { getLineFromPath } = useUrl();
  if (!getLineFromPath(to.path)) {
    return navigateTo('/404');
  }
});
