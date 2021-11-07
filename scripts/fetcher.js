export default function fetcher(path, callback) {
  fetch('https://api.publicapis.org' + path)
    .then((res) => res.json())
    .then((res) => {
      callback(res);
    });
}
