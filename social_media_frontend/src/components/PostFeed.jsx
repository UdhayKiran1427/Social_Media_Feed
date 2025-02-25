import { useState, useEffect } from "react"; 
import Modal from "./Modal"; 
import Navbar from "./Navbar";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  useEffect(() => {
const token = Cookies.get("authToken");
if (!token) {
  setError("You need to log in to view posts.");
  setLoading(false);
  return;
}
const fetchPosts = async () => {

      try {
        const token = Cookies.get("authToken");
        const response = await axios.get("http://localhost:5000/posts", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Post Feed
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Create New Post
        </Button>
        
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : (
          <Box>
            {posts.map((post) => (
              <Box key={post._id} sx={{ mb: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {post.content}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Posted by: {post.author?.username}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <Modal open={modalOpen} onClose={handleClose} /> {/* Modal for creating posts */}
    </div>
  );
};

export default PostFeed;
