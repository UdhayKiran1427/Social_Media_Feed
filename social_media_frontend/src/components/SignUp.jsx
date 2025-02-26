import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Paper, // Added import for Paper
} from "@mui/material";
import * as Yup from "yup";
import { NavLink } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import SnackBar from "./SnackBar";
import { useState } from "react";
const validationSchema = Yup.object({
  firstname: Yup.string()
    .min(2, "First name must have atleast 2 characters")
    .required("First name is required"),
  lastname: Yup.string()
    .min(2, "Last name must have atleast 2 characters")
    .required("Last name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  isPrivate: Yup.bool(),

});

const SignUp = () => {
    const [open, setOpen] = useState(false);
    const [message,setMessage] = useState("");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    error,  
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      isPrivate: false,
    },
  });

  const onSubmit = (data) => {
    axios
      .post("http://localhost:5000/sign-up", data)
      .then((response) => {
        console.log("Success:", response.data);
        setOpen(true)
        setMessage(response.data.message);
      })
      .catch((error) => console.error("Error:", error));
    reset();
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("username")}
            label="Username"
            fullWidth
            required
            error={!!errors.username}
            helperText={errors.username?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            {...register("email")}
            label="email"
            fullWidth
            required
            error={!!errors.username}
            helperText={errors.username?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            {...register("password")}
            label="Password"
            type="password"
            fullWidth
            required
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            {...register("firstname")}
            label="First Name"
            fullWidth
            required
            error={!!errors.firstname}
            helperText={errors.firstname?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            {...register("lastname")}
            label="Last Name"
            fullWidth
            required
            error={!!errors.lastname}
            helperText={errors.lastname?.message}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth>
            Sign Up
          </Button>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        </form>
      </Paper>
    </Box>
  );
};


export default SignUp;
