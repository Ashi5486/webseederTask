import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({ name: "", email: "" });
  const [avatar, setAvatar] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/users/me", {
        headers,
      });
      setUser(data);
      setForm({ name: data.name, email: data.email });
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update profile with avatar
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    if (avatar) formData.append("avatar", avatar);

    try {
      await axios.put("http://localhost:5000/api/users/update", formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile updated successfully!");
      fetchProfile();
      setAvatar(null);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };
  console.log(avatar+"",user)
  return (
    <div className="p-6 flex-1 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <form
        onSubmit={handleUpdateProfile}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        {/* Avatar */}
       <div className="relative w-24 h-24">
  {/* Image */}
  <img
    src={
      user.avatar
        ? `http://localhost:5000/uploads/${user.avatar}`
        : "https://via.placeholder.com/100"
    }
    alt="avatar"
    className="w-24 h-24 rounded-full object-cover border relative z-10"
  />

  {/* Hidden file input */}
  <input
    id="avatar"
    name="avatar"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => setAvatar(e.target.files[0])}
  />
  <label
  htmlFor="avatar"
  className="absolute inset-0 rounded-full bg-black/30 opacity-0 hover:opacity-100 
             text-white flex items-center justify-center transition z-20 cursor-pointer"
>
  Change
</label>

  {/* Label behind the image */}
  {!avatar && (
    <label
      htmlFor="avatar"
      className="
        absolute inset-0 
        rounded-full 
        bg-gray-200 
        flex items-center justify-center
        text-sm text-gray-600
        z-0
        cursor-pointer
      "
    >
      Upload
    </label>
  )}
  
</div>


        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
