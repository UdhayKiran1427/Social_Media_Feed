import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required."),
  content: Yup.string().required("Content is required."),
});

const Modal = ({ open, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("authToken");
      await axios.post("http://localhost:5000/posts", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onClose(); 
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="modal">
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Create New Post</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("title")}
            label="Title"
            fullWidth
            error={!!errors.title}
            helperText={errors.title?.message}
            margin="normal"
          />
          <TextField
            {...register("content")}
            label="Content"
            fullWidth
            multiline
            rows={4}
            error={!!errors.content}
            helperText={errors.content?.message}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default Modal;
