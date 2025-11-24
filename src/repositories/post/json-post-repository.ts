import { PostModel } from '@/models/post/post-model';
import { PostRepository } from './post-repository';
import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';

const PROJECT_ROOT_DIR = process.cwd();
const JSON_POSTS_FILEPATH = resolve(
  PROJECT_ROOT_DIR,
  'src',
  'db',
  'seed',
  'posts.json',
);

const simulatedWaitInMs = Number(process.env.SIMULATE_WAIT_IN_MS) || 0;

export class JsonPostRepository implements PostRepository {
  private async simulateWait() {
    if (simulatedWaitInMs <= 0) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, simulatedWaitInMs));
  }

  private async readFromDisk(): Promise<PostModel[]> {
    const fileContent = await readFile(JSON_POSTS_FILEPATH, 'utf-8');
    const jsonContent = JSON.parse(fileContent);
    const { posts } = jsonContent;
    return posts;
  }

  private async writeToDisk(posts: PostModel[]): Promise<void> {
    const jsonToString = JSON.stringify({ posts }, null, 2);
    await writeFile(JSON_POSTS_FILEPATH, jsonToString, 'utf-8');
  }

  async findAll(): Promise<PostModel[]> {
    await this.simulateWait();
    const posts = await this.readFromDisk();
    return posts;
  }

  async findAllPublishedPublic(): Promise<PostModel[]> {
    await this.simulateWait();
    const posts = await this.readFromDisk();
    return posts.filter((post) => post.published === true);
  }

  async findById(id: string): Promise<PostModel> {
    const posts = await this.findAll();
    const post = posts.find((post) => post.id === id);

    if (!post) throw new Error('Post not found by the specified id');

    return post;
  }

  async findBySlugPublic(slug: string): Promise<PostModel> {
    const posts = await this.findAll();
    const post = posts.find((post) => post.slug === slug);

    if (!post) throw new Error('Post not found by the specified slug');

    return post;
  }

  async create(post: PostModel): Promise<PostModel> {
    const posts = await this.findAll();

    if (!post.id || !post.slug) {
      throw new Error('Post without ID or slug');
    }

    const idOrSlugExist = posts.find(
      (savedPost) => savedPost.id === post.id || savedPost.slug === post.slug,
    );

    if (idOrSlugExist) {
      throw new Error('ID or slug must be unique');
    }

    posts.push(post);

    await this.writeToDisk(posts);

    return post;
  }

  async delete(id: string): Promise<PostModel> {
    const posts = await this.findAll();
    const postIndex = posts.findIndex((p) => p.id === id);

    if (postIndex < 0) {
      throw new Error('Post does not exist');
    }

    const post = posts[postIndex];
    posts.splice(postIndex, 1);
    await this.writeToDisk(posts);

    return post;
  }

  async update(
    id: string,
    newPostData: Omit<PostModel, 'id' | 'slug' | 'createdAt' | 'updatedAt'>,
  ): Promise<PostModel> {
    const posts = await this.findAll();
    const postIndex = posts.findIndex((p) => p.id === id);

    if (postIndex < 0) {
      throw new Error('Post does not exist');
    }
    const savedPost = posts[postIndex];

    const newPost = {
      ...savedPost,
      ...newPostData,
      updatedAt: new Date().toISOString(),
    };

    posts[postIndex] = newPost;
    await this.writeToDisk(posts);

    return newPost;
  }
}
