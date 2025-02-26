import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useLoginMutation } from '../apiSlice';
import { useAuth } from '../AuthContext';

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required."),
  password: Yup.string().required("Password is required."),
});

const SignIn = () => {
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const [loginUser] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data).unwrap();
      login(response); 
    } catch (err) {
      setError(err.data?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Sign In
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <Button type="submit" variant="contained" fullWidth>
            Sign In
          </Button>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        </form>
      </Paper>
    </Box>
  );
};

export default SignIn;
