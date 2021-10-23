export async function verifyAuth(token: string): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }
  const head = atob(parts[0]);
  const body = atob(parts[1]);
  JSON.parse(head);
  JSON.parse(body);
  return true;
}

// Todo: This is the file for validating the application
