export function getClientIp(request: Request): string {
  let clientIp =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    (request as unknown as { connection: { remoteAddress: string } }).connection
      .remoteAddress;

  if (
    clientIp === undefined ||
    clientIp === null ||
    clientIp === "" ||
    clientIp === "::1"
  ) {
    clientIp = "185.240.76.109";
  }

  return clientIp;
}
