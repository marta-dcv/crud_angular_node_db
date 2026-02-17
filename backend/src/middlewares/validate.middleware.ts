import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate =
  (schema: ZodSchema, where: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[where]);

      // Handle query separately because it's read-only
      if (where === 'query') {
        // Option A: mutate existing query object
        Object.assign(req.query, parsed);

        // Option B: alternatively, store validated query separately
        // (req as any).validatedQuery = parsed;
      } else {
        (req as any)[where] = parsed;
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: err.issues.map(i => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        });
      }
      next(err);
    }
  };
