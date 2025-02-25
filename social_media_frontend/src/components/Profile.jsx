import { useState, useEffect } from "react";
import { Box, FormControl, TextField, FormLabel, CircularProgress, Typography } from "@mui/material";
import { Button } from "@mui/material";
import Navbar from "./Navbar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";


const validationSchema = Yup.object({
  name: Yup.string().required("Name is required."),
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Email address is required.")
    ,
  password: Yup.string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters long."),
  confirmPassword: Yup.string()
    .required("Confirm password is required.")
    .oneOf([Yup.ref("password"), null], "Passwords must match."),
});
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("authToken");
        const response = await axios.get("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
        setValue("name", response.data.name);
        setValue("email", response.data.email);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("authToken");
      await axios.put("http://localhost:5000/profile", data, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div style={{display:"flex",flexDirection:"column", alignItems:"center"}}>
      <Navbar/>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      ) : (
        <>
          <h1>Profile</h1>

          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            onSubmit={handleSubmit(onSubmit)}
          >

            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                {...register("name")}
                autoComplete="name"
                fullWidth
                placeholder="Enter name"
                error={!!errors.name}
                helperText={errors.name?.message}
                color={errors.name ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                {...register("email")}
                required
                fullWidth
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                color={errors.email ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                {...register("password")}
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                color={errors.password ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <TextField
                {...register("confirmPassword")}
                required
                fullWidth
                name="confirmPassword"
                placeholder="••••••"
                type="password"
                variant="outlined"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                color={errors.confirmPassword ? "error" : "primary"}
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained">
              Update Profile
            </Button>
          </Box>
        </>
      )}
    </div>
  );
}

export default Profile;
