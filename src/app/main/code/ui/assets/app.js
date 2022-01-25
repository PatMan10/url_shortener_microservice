const form = document.getElementById("url-form");
const urlInput = document.getElementById("url-input");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = JSON.stringify({ url: urlInput.value });
  const res = await fetch("http://localhost:8000/api/shorturl", {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: data,
  });
  console.log(await res.text());
});
