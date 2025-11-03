# Support for MyFlower v2

Thank you for using **MyFlower**! If you encounter any issues, need assistance, or have questions, this guide will help you get support efficiently.

---

## Reporting Issues

If you find a bug or unexpected behavior:

1. Open an **issue** in the GitHub repository:  
   [MyFlower Issues](https://github.com/afifudin23/myflower-v2/issues)

2. Include the following information:

   - Steps to reproduce the issue  
   - Expected behavior vs actual behavior  
   - Screenshots (if applicable)  
   - Any relevant logs or error messages  

---

## Questions & Assistance

If you have questions or need help, please open an **issue** in the GitHub repository: [MyFlower Issues](https://github.com/afifudin23/myflower-v2/issues)

When creating an issue, include:

- Your environment (OS, Node.js version, browser, etc.)  
- Steps you have tried to resolve the issue

---

## Feature Requests

Want to suggest new features or improvements?  

1. Open a **new issue** in GitHub  
2. Label it as `feature request`  
3. Provide details about:

   - The feature and its purpose  
   - Benefits to users  
   - Any related workflows or examples  

---

## Recommended GitHub Labels

To help organize issues, we suggest using the following labels:

- **bug** → For any bugs or unexpected behavior  
- **feature request** → For new feature suggestions  
- **question** → For general questions or assistance  
- **help wanted** → If a contributor wants to help with a specific task  

---

## FAQs (Common Issues)

1. **Server won’t start**  
   - Check that `.env` is correctly configured  
   - Run `npm install` in both backend and frontend folders

2. **Frontend cannot reach backend API**  
   - Verify `VITE_BASE_API_URL` in `.env` matches your backend server URL

3. **Prisma migrations fail**  
   - Ensure `DATABASE_URL` in `.env` is correct  
   - Run:

   ```bash
   npx prisma migrate deploy
