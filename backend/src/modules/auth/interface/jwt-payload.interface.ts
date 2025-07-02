export type JwtUserInfo = {
  sid: string; // sessionId
  sub: string; // userId

  sessionId: string; // sessionId
  clerkUserId: string; // sub <=> clerkUserId
  userId: number; // userId
};

export type JwtPayload = JwtUserInfo & {
  nbf: number; // not before
  azp: string; // authorized party
  exp: number; // expiration

  fva: number[]; // future version array
  v: number; // version

  iss: string; // issuer
  iat: number; // issued at
};

// {
//   azp: 'http://localhost:3000',
//   exp: 1746552348,
//   fva: [ 54, -1 ],
//   iat: 1746552288,
//   iss: 'https://peaceful-werewolf-62.clerk.accounts.dev',
//   nbf: 1746552278,
//   sid: 'sess_2wjJRdVQRWrpsd7TwhXFcD5W6cC',
//   sub: 'user_2wjJRdt8Frn5Lb6uYhOJgj3P2v7',
//   v: 2
// }
