const sanityConfig = {
  projectId: "YOUR_PROJECT_ID",
  dataset: "production",
  apiVersion: "2025-01-01",
};

const postQuery = `*[_type == "post"] | order(_createdAt desc)[0...6]{
  _id,
  title,
  excerpt,
  publishedAt
}`;

const statusEl = document.querySelector("#status");
const postsEl = document.querySelector("#posts");

const setStatus = (message) => {
  statusEl.textContent = message;
};

const renderPost = (post) => {
  const article = document.createElement("article");
  article.className = "post";

  const title = document.createElement("h2");
  title.textContent = post.title || "Untitled";
  article.appendChild(title);

  if (post.publishedAt) {
    const published = document.createElement("time");
    published.dateTime = post.publishedAt;
    published.textContent = new Date(post.publishedAt).toLocaleDateString();
    article.appendChild(published);
  }

  if (post.excerpt) {
    const excerpt = document.createElement("p");
    excerpt.textContent = post.excerpt;
    article.appendChild(excerpt);
  }

  return article;
};

const fetchPosts = async () => {
  if (
    !sanityConfig.projectId ||
    sanityConfig.projectId === "YOUR_PROJECT_ID" ||
    !sanityConfig.dataset
  ) {
    setStatus("Set your Sanity projectId and dataset in app.js to load content.");
    return;
  }

  const url = new URL(
    `https://${sanityConfig.projectId}.api.sanity.io/v${sanityConfig.apiVersion}/data/query/${sanityConfig.dataset}`
  );
  url.searchParams.set("query", postQuery);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    const payload = await response.json();
    const posts = payload?.result || [];

    if (!posts.length) {
      setStatus("Connected to Sanity, but no posts were found.");
      return;
    }

    setStatus(`Loaded ${posts.length} post${posts.length === 1 ? "" : "s"} from Sanity.`);
    posts.forEach((post) => postsEl.appendChild(renderPost(post)));
  } catch (error) {
    setStatus(`Could not load posts from Sanity: ${error.message}`);
  }
};

fetchPosts();
