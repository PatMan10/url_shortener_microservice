const form = document.getElementById("url-form");
const urlInput = document.getElementById("url-input");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = urlInput.value;
  const res = await fetch("http://localhost:8000/api/shorturl", {
    headers: {
      "content-type": "application/json",
      "charset": "utf-8",
    },
    method: "POST",
    body: JSON.stringify({ url }),
  });
  console.log(await res.text());
});
