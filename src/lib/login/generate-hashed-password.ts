import { hashPassword, verifyPassword } from './manage-login';

//For generating and testing password
(async () => {
  const envPass = await hashPassword('your_password_here');
  console.log(envPass);
  const testPass = await verifyPassword(
    'your_password_here',
    'your_base64_hashed_password_here',
  );
  console.log(testPass);
})();
