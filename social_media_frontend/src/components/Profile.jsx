import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  TextField,
  FormLabel,
  CircularProgress,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  Avatar,
  Grid,
} from "@mui/material";
import Navbar from "./Navbar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useGetUserQuery, useUpdateUserMutation } from '../apiSlice';
import { useAuth } from '../AuthContext';

const validationSchema = Yup.object({
  firstname: Yup.string().required("First Name is required."),
  lastname: Yup.string().required("Last Name is required."),
  username: Yup.string().required("Username is required."),
  isPrivate: Yup.boolean(),
});

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { data: profileData, error } = useGetUserQuery();
  const [updateUser] = useUpdateUserMutation();
  const [updateMessage, setUpdateMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (profileData) {
      setValue("firstname", profileData.firstname);
      setValue("lastname", profileData.lastname);
      setValue("username", profileData.username);
      setValue("isPrivate", profileData.isPrivate);
    }
  }, [profileData, setValue]);

  const onSubmit = async (data) => {
    try {
      await updateUser(data).unwrap();
      console.log("Update Success");
      setUpdateMessage("Profile updated successfully");
      setIsEditing(false); // Exit edit mode on success
    } catch (err) {
      console.error("Failed to update profile:", err);
      setUpdateMessage(null);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setUpdateMessage(null); // Clear success message when toggling
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Navbar />
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        {error ? (
          <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
            {error}
          </Typography>
        ) : !profileData ? ( 
          <CircularProgress />
        ) : (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            {/* Profile Header */}
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: "#1976d2",
                    fontSize: 48,
                    fontWeight: "bold",
                  }}
                >
                  {`${watch("firstname")?.charAt(0)?.toUpperCase() || ""}${watch("lastname")?.charAt(0)?.toUpperCase() || ""}`}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" gutterBottom>
                  {watch("firstname")} {watch("lastname")}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  @{watch("username")}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={handleEditToggle}
                  sx={{ textTransform: "none" }}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </Grid>
            </Grid>

            {/* Stats */}
            <Box sx={{ mt: 3, display: "flex", gap: 4 }}>
              <Typography variant="body1">
                <strong>{profileData.followersCount || 0}</strong> Followers
              </Typography>
              <Typography variant="body1">
                <strong>{profileData.followingCount || 0}</strong> Following
              </Typography>
              <Typography variant="body1">
                <strong>{profileData.postsCount || 0}</strong> Posts
              </Typography>
            </Box>

            {/* Profile Details */}
            <Box sx={{ mt: 4 }}>
              {isEditing ? (
                <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <TextField
                      {...register("firstname")}
                      autoComplete="given-name"
                      fullWidth
                      placeholder="Enter first name"
                      error={!!errors.firstname}
                      helperText={errors.firstname?.message}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <TextField
                      {...register("lastname")}
                      autoComplete="family-name"
                      fullWidth
                      placeholder="Enter last name"
                      error={!!errors.lastname}
                      helperText={errors.lastname?.message}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Username</FormLabel>
                    <TextField
                      {...register("username")}
                      fullWidth
                      placeholder="Enter username"
                      error={!!errors.username}
                      helperText={errors.username?.message}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...register("isPrivate")}
                        checked={watch("isPrivate") || false}
                        color="primary"
                        name="isPrivate"
                        disabled={!isEditing}
                      />
                    }
                    label="Private Profile"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={!isEditing}
                    sx={{ mt: 2 }}
                  >
                    Save Changes
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="body1">
                    <strong>First Name:</strong> {profileData.firstname}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Last Name:</strong> {profileData.lastname}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Username:</strong> @{profileData.username}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Profile Privacy:</strong>{" "}
                    {profileData.isPrivate ? "Private" : "Public"}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Success Message */}
            {updateMessage && (
              <Typography color="success.main" sx={{ mt: 2, textAlign: "center" }}>
                {updateMessage}
              </Typography>
            )}
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Profile;
