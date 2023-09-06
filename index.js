const http = require('http');
const url = require('url');
const {createHash} = require('crypto');

const calculateHash = (str) => {
	const hash = createHash('sha256');
	hash.update(str);
	return hash.digest('hex');
}

const resultados = {
	pessoas: [{id:1, nome: "Marcelo"}, {id:2, nome: "João"}, {id:3, nome: "Maria"}],
	carros: [{id:1, modelo: "Fusca"}, {id:2, modelo: "Gol"}, {id:3, modelo: "Palio"}],
	animais: [{id:1, nome: "Cachorro"}, {id:2, nome: "Gato"}, {id:3, nome: "Papagaio"}]
  }

const server = http.createServer((req, res) => {
	const parsedUrl = url.parse(req.url, true);
	const path = parsedUrl.path;
	console.info(path);
	const pathSegments = parsedUrl.pathname.split('/');
	console.info(pathSegments);
	if (pathSegments.length>=3){
		if ((pathSegments[1] === "pessoas" || pathSegments[1] === "carros" || pathSegments[1] === "animais")) {
			res.writeHead(200, {'cache-control': "no-store", 'content-type': "application/json"})
			res.end(buscarPorId(pathSegments[1], +pathSegments[2]));
		} else {
			if (req.headers['if-none-match'] === calculateHash(buscarPorId(pathSegments[1], +pathSegments[2]))) {
				res.writeHead(304);
				res.end();
				return;
			}
			res.writeHead(200,
				{
					'cache-control': "max-age=10, must-revalidate",
					"etag": calculateHash(buscarPorId(pathSegments[1], +pathSegments[2]))
				});
			res.end(buscarPorId(pathSegments[1], +pathSegments[2]));
		}
	} else {
		res.end()
		}
});

function buscarPorId(tipo, id) {
	if (!resultados[tipo]) {
	  return null;  // ou você pode lançar um erro, se preferir.
	}
	return JSON.stringify(resultados[tipo].find(item => item.id === id));
  }
  
const port = 3000;
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
