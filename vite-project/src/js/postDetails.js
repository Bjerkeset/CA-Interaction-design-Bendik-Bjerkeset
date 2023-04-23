const postId = new URLSearchParams(window.location.search).get("postId");
const postContainer = document.querySelector("#js-post-container");

async function fetchPostDetails() {
  try {
    const url = `https://bjerkeset.dev/wp-json/wp/v2/posts/${postId}`;
    const response = await fetch(url, { method: "GET" });

    const postContent = await response.json();
    postContainer.innerHTML = `
    <h2 class="post">${postContent.title.rendered}</h2>
    <p class="post">${postContent.content.rendered}</p>
    `;
  } catch (error) {
    console.error("Error:", error);
  }
}
fetchPostDetails();
