import { JsonPostRepository } from '@/repositories/post/json-post-repository';
import { drizzleDb } from '.';
import { postsTable } from './schemas';

(async () => {
  const jsonRepository = new JsonPostRepository();
  const posts = await jsonRepository.findAll();

  try {
    await drizzleDb.insert(postsTable).values(posts);
    console.log('Post seed successfully added into sqlite database');
  } catch (e) {
    console.error(
      'Error has happened while adding posts seed into sqlite database:',
    );
    console.error(e);
  }
})();
