const contentElement = document.querySelector("#js-list-container");

async function fetchPost() {
  try {
    const url = "https://bjerkeset.dev/wp-json/wp/v2/posts/";
    const response = await fetch(url, { method: "GET" });

    const data = await response.json();
    console.log("worpress data: ", data);

    for (let i = 0; i < data.length; i++) {
      const postContent = data[i];
      const postElement = document.createElement("a");
      postElement.classList.add("post");
      postElement.href = `/blog-details.html?postId=${postContent.id}`;
      postElement.innerHTML = `
        <h2>${postContent.title.rendered}</h2>
        <p>${postContent.excerpt.rendered}</p>
      `;
      contentElement.appendChild(postElement);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
fetchPost();
