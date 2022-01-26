const form = document.getElementById("url-form");
const urlInput = document.getElementById("url-input");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = urlInput.value;
  console.log(url);
  const res = await fetch("http://localhost:8000/api/shorturl", {
    headers: {
      "content-type": "text/html",
      "charset": "utf-8",
    },
    method: "POST",
    body: url,
  });
  console.log(await res.text());
});
