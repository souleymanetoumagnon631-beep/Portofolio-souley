export default async function handler(request) {
  return new Response('web-ok', { status: 200, headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
