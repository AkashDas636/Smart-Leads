# Pre-Deployment Checklist

Complete this checklist before deploying to production.

## Code Quality

- [ ] All TypeScript errors are fixed (`pnpm run build` succeeds)
- [ ] Linting passes (`pnpm lint`)
- [ ] No console.log() or debugger statements in production code
- [ ] No secrets/passwords in code or git history
- [ ] All dependencies are pinned to specific versions
- [ ] No deprecated dependencies (run `npm audit`)
- [ ] All imports are used (no unused imports)

## Security

- [ ] JWT_SECRET is strong (32+ characters, random)
- [ ] MongoDB password is strong
- [ ] Environment variables are never committed to git
- [ ] `.env` files are in `.gitignore`
- [ ] CORS is configured correctly for frontend domain
- [ ] Rate limiting is enabled
- [ ] Password hashing uses bcrypt (at least 10 rounds)
- [ ] No sensitive data in error messages
- [ ] HTTPS is enabled in production
- [ ] SQL injection protection enabled (Mongoose prevents this)

## Frontend

- [ ] `.env.production` has correct API URL
- [ ] `VITE_API_URL` points to production backend
- [ ] Build succeeds: `cd frontend && pnpm build`
- [ ] dist/ folder contains optimized assets
- [ ] No console errors in DevTools
- [ ] Responsive design tested on mobile
- [ ] Dark mode works correctly
- [ ] All forms validate properly
- [ ] Error handling is user-friendly
- [ ] Loading states are visible

## Backend

- [ ] Database migrations completed
- [ ] API endpoints tested with real data
- [ ] Error handling returns proper status codes
- [ ] Logging is configured (not too verbose)
- [ ] Rate limiting is configured
- [ ] CORS headers are set correctly
- [ ] Helmet security headers are enabled
- [ ] Request validation is in place
- [ ] Response format is consistent
- [ ] Build succeeds: `cd backend && npm run build`

## Database

- [ ] MongoDB Atlas cluster is created
- [ ] Database user has correct permissions
- [ ] IP whitelist includes deployment IP
- [ ] Backup is scheduled
- [ ] Connection string is correct
- [ ] Database indexes are created
- [ ] No test data remains in production

## Deployment Configuration

- [ ] Vercel project is created and linked
- [ ] GitHub secrets are set (VERCEL_TOKEN, etc.)
- [ ] Environment variables are set in Vercel
- [ ] Build command is correct
- [ ] Output directory is correct
- [ ] Domains are configured
- [ ] SSL certificate is valid
- [ ] Redirects are configured (http → https)

## GitHub Setup

- [ ] Repository is public (if portfolio)
- [ ] `.gitignore` is comprehensive
- [ ] `.gitattributes` is configured
- [ ] Branch protection is enabled on main
- [ ] Meaningful commit messages exist
- [ ] README.md is complete
- [ ] CONTRIBUTING.md is present
- [ ] DEPLOYMENT.md is present
- [ ] GITHUB_SETUP.md is present
- [ ] LICENSE file is included

## Documentation

- [ ] README.md explains the project
- [ ] API endpoints are documented
- [ ] Environment variables are documented
- [ ] Setup instructions are clear
- [ ] Deployment guide is complete
- [ ] Contributing guidelines exist
- [ ] Error codes are documented
- [ ] Performance optimization tips exist

## Performance

- [ ] Frontend build size is < 500KB (gzipped)
- [ ] API response times are < 500ms
- [ ] Database queries are optimized
- [ ] Lazy loading is implemented for images
- [ ] Code splitting is configured
- [ ] Caching headers are set
- [ ] Minification is enabled
- [ ] Tree-shaking is enabled

## Testing

- [ ] Login flow works end-to-end
- [ ] Create lead works and saves to DB
- [ ] Update lead works correctly
- [ ] Delete lead works (if applicable)
- [ ] Filters work properly
- [ ] Export CSV works
- [ ] Analytics show correct data
- [ ] Role-based access control works
- [ ] Error messages are helpful
- [ ] Timeout handling works

## Monitoring

- [ ] Error tracking is configured (Sentry, etc.)
- [ ] Uptime monitoring is enabled
- [ ] Log aggregation is setup
- [ ] Performance metrics are tracked
- [ ] Alert notifications are configured
- [ ] Health check endpoint exists

## Final Checks

- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on iPhone, Android, iPad
- [ ] Tested on slow network (throttle in DevTools)
- [ ] Tested with large datasets
- [ ] Tested with real API data
- [ ] Tested error scenarios
- [ ] Manual smoke test completed
- [ ] Team review completed

## Post-Deployment

- [ ] Monitor error logs for first 24 hours
- [ ] Check analytics for traffic
- [ ] Verify all features work in production
- [ ] Test API endpoints with curl
- [ ] Confirm emails are being sent (if applicable)
- [ ] Monitor performance metrics
- [ ] Check search engine indexing
- [ ] Create backup snapshot

## Rollback Plan

If production breaks:

1. **Immediate:** Revert to last stable commit
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. **Via Vercel:** Click "Deployments" → Previous version → "Promote to Production"

3. **Via Database:** Restore from backup (MongoDB Atlas snapshots)

4. **Communication:** Notify team/users of incident

## Support Links

- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Help](https://docs.atlas.mongodb.com)
- [GitHub Docs](https://docs.github.com)
- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)

---

**Last Updated:** 2024
**Version:** 1.0.0
