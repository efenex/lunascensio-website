addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// add a link to the raw file content host pointed at your primary ref
const REPO_URL = 'https://raw.githubusercontent.com/efenex/lunascensio-website/main/'

const mimeTable = {
  'html': 'text/html',
  'css': 'text/css',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'text/javascript',
  'json': 'application/json',
  'png': 'image/png',
  'txt': 'text/plain'
}

const securityHeaders = {
	"Content-Security-Policy" : "upgrade-insecure-requests",
}

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  const req = new Request(request);

  let path = req.url.split('/').slice(3).join('/');
  if (path=="") path = "index.html";

  let extension = path.split('.').pop();
  if (extension=="") extension = "txt";
  
  const file = await fetch(REPO_URL + path);
  if (!file.ok) return new Response(null, {status: file.status});

  const response = new Response(file.body, file);

  const contentDisposition = response.headers.get('content-disposition');
  if (contentDisposition) response.headers.delete('content-disposition');

  response.headers.set('content-type', mimeTable[extension]);
  response.headers.set('content-security-policy', "img-src 'self' data:")
  return response;
}
