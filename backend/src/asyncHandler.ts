import { NextFunction, Request, RequestHandler, Response } from 'express';

// Express 4 doesn't forward rejected promises from async route handlers to
// the error middleware on its own — without this, a failed `await sql\`...\``
// would crash the process instead of producing a clean 500 response.
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
