import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';
import { isUrlOrRelativePath } from '@/utils/is-url-or-relative-path';

const PostBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Título deve ter, no mínimo, 3 caracteres')
    .max(120, 'Título deve ter, no máximo, 120 caracteres'),
  content: z
    .string()
    .trim()
    .min(3, 'O conteúdo não pode estar vazio')
    .transform((val) => sanitizeHtml(val)),
  author: z
    .string()
    .trim()
    .min(3, 'Autor deve ter, no mínimo, 3 caracteres')
    .max(100, 'Autor deve ter, no máximo, 100 caracteres'),
  excerpt: z
    .string()
    .trim()
    .min(3, 'Excerto deve ter, no mínimo, 3 caracteres')
    .max(200, 'Excerto deve ter, no máximo, 200 caracteres'),
  coverImageUrl: z.string().trim().refine(isUrlOrRelativePath, {
    message: 'URL da capa deve ser uma URL ou caminho para imagem',
  }),
  published: z
    .union([
      z.literal('on'),
      z.literal('true'),
      z.literal('false'),
      z.literal(true),
      z.literal(false),
      z.literal(null),
      z.literal(undefined),
    ])
    .default(false)
    .transform((val) => val === 'on' || val === 'true' || val === true),
});

export const PostCreateSchema = PostBaseSchema;

export const PostUpdateSchema = PostBaseSchema.extend({
  // id: z.string().uuid('ID inválido'),
});
