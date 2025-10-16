// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Request } from 'express';

// @Injectable()
// export class IsAdminAuthGuard implements CanActivate {
//   constructor(private readonly userIsAdminUseCase: UserIsAdmin) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request: Request = context.switchToHttp().getRequest();
//     const userId = request.user;

//     try {
//       if (isAdmin) {
//         return true;
//       }
//       throw new Error();
//     } catch (error) {
//       throw new Error('Usuário não autorizado: ' + (error as Error).message);
//     }
//   }
// }
