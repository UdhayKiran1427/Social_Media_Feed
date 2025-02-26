import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress } from "@mui/material";

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/posts/get-feed-posts?page=${page}&perPage=20`);
      setPosts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      {posts.map((post) => (
        <Box key={post.id} sx={{ mb: 2, p: 2, border: "1px solid #ccc" }}>
          <Typography variant="h6">{post.title}</Typography>
          <Typography>{post.body}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default PostFeed;
