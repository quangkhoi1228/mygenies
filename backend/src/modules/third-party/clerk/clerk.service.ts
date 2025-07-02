import { createClerkClient, verifyToken } from '@clerk/backend';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClerkService {
  constructor() {
    this.test();
  }

  getClerkClient() {
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    return clerkClient;
  }

  async getUserById(userId: string) {
    const clerkClient = this.getClerkClient();
    try {
      const user = await clerkClient.users.getUser(userId);

      return user;
    } catch (error) {
      console.error('error', error);

      return null;
    }
  }

  async verifyRequest(req: Request) {
    const clerkClient = this.getClerkClient();

    try {
      const payload = await clerkClient.authenticateRequest(req, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      return payload;
    } catch (error) {
      console.error('error', error);

      // return null;
    }
  }

  async verifyToken(token: string) {
    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      return payload;
    } catch (error) {
      console.error('error', error);

      // return null;
    }
  }

  async test() {
    // const clerkClient = this.getClerkClient();
    // const userList = await clerkClient.users.getUserList();
    // const user = await clerkClient.users.getUser(userList.data[0].id);
    // const data = await verifyToken(
    //   'eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yd2ozaGtTdmxBdVdicUdLM05TZ3huUFBWYUciLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3NDY1NTI1NTUsImZ2YSI6WzU3LC0xXSwiaWF0IjoxNzQ2NTUyNDk1LCJpc3MiOiJodHRwczovL3BlYWNlZnVsLXdlcmV3b2xmLTYyLmNsZXJrLmFjY291bnRzLmRldiIsIm5iZiI6MTc0NjU1MjQ4NSwic2lkIjoic2Vzc18yd2pKUmRWUVJXcnBzZDdUd2hYRmNENVc2Y0MiLCJzdWIiOiJ1c2VyXzJ3akpSZHQ4RnJuNUxiNnVZaE9KZ2ozUDJ2NyIsInYiOjJ9.QT7lWXPbWs6yGmMBCbJyhxSPC7pNUlm2_XaWFjPmdEA0Z8yPGDG0PPs8RM7X8OIfko3tCwXNwu7PE4Q0w9PBm-5htSpDOeIHIy8X4UjtAO6p_cPGbUF1tsyoGNQua2opALFe6EAuvsOM86XXp8rMfTIJYE6tLnnmzB6MI1MBuUnjmu0SYxxnUL4849O8JNBacAXadWVsIblShCQL0a_HO0VZJOug6XDkakTWTGtVi2XG0bUFD_6afXrF0_WoGzoE2p4sS40NUDJQZKJH1xYFZrJQh246dPTMYJ1KfZZRCV6rnp6-2AAcCGLBUX3yRg7PisYyJ8i3Nv4L-bTHFs1d7Q',
    //   {
    //     secretKey: process.env.CLERK_SECRET_KEY,
    //   },
    // );
    // console.log('data', data);
    // const tokenList = await clerkClient.sessions.getSessionList();
    // console.log(userList);
    // console.log(token);
    // console.log(user);
  }
}
