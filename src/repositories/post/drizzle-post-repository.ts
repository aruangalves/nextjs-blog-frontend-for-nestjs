import { PostModel } from '@/models/post/post-model';
import { PostRepository } from './post-repository';
import { drizzleDb } from '@/db/drizzle';
import { postsTable } from '@/db/drizzle/schemas';
import { eq } from 'drizzle-orm';

export class DrizzlePostRepository implements PostRepository {
  async findAllPublishedPublic(): Promise<PostModel[]> {
    //Creating a query with query builder
    /*const query = drizzleDb
      .select()
      .from(postsTable)
      .where(eq(postsTable.published, true))
      .orderBy(desc(postsTable.createdAt));

    const result = await query;*/

    //Another method that doesn't require imports
    const posts = await drizzleDb.query.posts.findMany({
      orderBy: (posts, { desc }) => desc(posts.createdAt),
      where: (posts, { eq }) => eq(posts.published, true),
    });

    return posts;
  }

  async findBySlugPublic(slug: string): Promise<PostModel> {
    const post = await drizzleDb.query.posts.findFirst({
      where: (posts, { eq, and }) =>
        and(eq(posts.published, true), eq(posts.slug, slug)),
    });

    if (!post) throw new Error('Post not found by the specified slug');

    return post;
  }

  async findAll(): Promise<PostModel[]> {
    const posts = await drizzleDb.query.posts.findMany({
      orderBy: (posts, { desc }) => desc(posts.createdAt),
    });

    return posts;
  }
  async findById(id: string): Promise<PostModel> {
    const post = await drizzleDb.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    });

    if (!post) throw new Error('Post not found by the specified id');

    return post;
  }

  async create(post: PostModel): Promise<PostModel> {
    const postExists = await drizzleDb.query.posts.findFirst({
      where: (posts, { or, eq }) =>
        or(eq(posts.id, post.id), eq(posts.slug, post.slug)),
      columns: { id: true },
    });

    if (!!postExists) {
      throw new Error(
        'Post with the provided ID or slug already exists in database',
      );
    }

    await drizzleDb.insert(postsTable).values(post);
    return post;
  }

  async delete(id: string): Promise<PostModel> {
    const post = await drizzleDb.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    });

    if (!post) {
      throw new Error('Post does not exist');
    }

    await drizzleDb.delete(postsTable).where(eq(postsTable.id, id));

    return post;
  }

  async update(
    id: string,
    newPostData: Omit<PostModel, 'id' | 'slug' | 'createdAt' | 'updatedAt'>,
  ): Promise<PostModel> {
    const oldPost = await drizzleDb.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    });

    if (!oldPost) {
      throw new Error('Post does not exist');
    }

    const updatedDate = new Date().toISOString();
    const postData = {
      author: newPostData.author,
      content: newPostData.content,
      coverImageUrl: newPostData.coverImageUrl,
      excerpt: newPostData.excerpt,
      published: newPostData.published,
      title: newPostData.title,
      updatedAt: updatedDate,
    };

    await drizzleDb
      .update(postsTable)
      .set(postData)
      .where(eq(postsTable.id, id));

    return {
      ...oldPost,
      ...postData,
    };
  }
}
