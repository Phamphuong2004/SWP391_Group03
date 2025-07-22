import React, { useState } from "react";
import {
  getTestCategoryById,
  getAllTestCategoriesByService,
  getActiveTestCategoriesByService,
  createTestCategory,
  updateTestCategory,
  deleteTestCategory,
} from "./TestCategoryAPI";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";

export default function TestCategoryManager() {
  const [categoryId, setCategoryId] = useState("");
  const [category, setCategory] = useState(null);
  const [form, setForm] = useState({
    testCategoryName: "",
    serviceName: "",
    active: true,
  });
  const [updateId, setUpdateId] = useState("");
  const [updateForm, setUpdateForm] = useState({
    testCategoryName: "",
    serviceName: "",
    active: true,
  });
  const [serviceName, setServiceName] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [idError, setIdError] = useState("");
  const [serviceNameError, setServiceNameError] = useState("");

  // Lấy chi tiết theo id
  const handleGetById = async () => {
    setMessage("");
    setIdError("");
    if (!categoryId || isNaN(categoryId) || Number(categoryId) <= 0) {
      setIdError("ID phải là số dương");
      return;
    }
    setCategory(null);
    try {
      const res = await getTestCategoryById(categoryId);
      setCategory(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Không tìm thấy hoặc lỗi API");
    }
  };

  // Thêm mới
  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");
    setFormError("");
    if (!form.testCategoryName.trim() || !form.serviceName.trim()) {
      setFormError("Không được để trống tên test category hoặc service name");
      return;
    }
    if (/[^\p{L}\p{N}\s]/u.test(form.serviceName)) {
      setFormError("Service name không được chứa ký tự đặc biệt");
      return;
    }
    try {
      await createTestCategory(form);
      setMessage("Tạo thành công!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Tạo thất bại hoặc lỗi API");
    }
  };

  // Xóa theo id
  const handleDelete = async () => {
    setMessage("");
    setIdError("");
    if (!categoryId || isNaN(categoryId) || Number(categoryId) <= 0) {
      setIdError("ID phải là số dương");
      return;
    }
    try {
      await deleteTestCategory(categoryId);
      setMessage("Đã xóa thành công!");
      setCategory(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "Xóa thất bại hoặc lỗi API");
    }
  };

  // Cập nhật
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setUpdateError("");
    if (!updateId || isNaN(updateId) || Number(updateId) <= 0) {
      setUpdateError("ID phải là số dương");
      return;
    }
    if (!updateForm.testCategoryName.trim() || !updateForm.serviceName.trim()) {
      setUpdateError("Không được để trống tên test category hoặc service name");
      return;
    }
    if (/[^\p{L}\p{N}\s]/u.test(updateForm.serviceName)) {
      setUpdateError("Service name không được chứa ký tự đặc biệt");
      return;
    }
    try {
      await updateTestCategory(updateId, updateForm);
      setMessage("Cập nhật thành công!");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Cập nhật thất bại hoặc lỗi API"
      );
    }
  };

  // Lấy tất cả theo serviceName
  const handleGetAllByService = async () => {
    setMessage("");
    setCategories([]);
    setServiceNameError("");
    if (!serviceName.trim()) {
      setServiceNameError("Vui lòng nhập service name");
      return;
    }
    if (/[^\p{L}\p{N}\s]/u.test(serviceName)) {
      setServiceNameError("Service name không được chứa ký tự đặc biệt");
      return;
    }
    try {
      const res = await getAllTestCategoriesByService(serviceName);
      setCategories(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Không tìm thấy hoặc lỗi API");
    }
  };

  // Lấy active theo serviceName
  const handleGetActiveByService = async () => {
    setMessage("");
    setCategories([]);
    setServiceNameError("");
    if (!serviceName.trim()) {
      setServiceNameError("Vui lòng nhập service name");
      return;
    }
    if (/[^\p{L}\p{N}\s]/u.test(serviceName)) {
      setServiceNameError("Service name không được chứa ký tự đặc biệt");
      return;
    }
    try {
      const res = await getActiveTestCategoriesByService(serviceName);
      setCategories(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Không tìm thấy hoặc lỗi API");
    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        maxWidth: 500,
        mx: "auto",
        my: 6,
        p: 4,
        borderRadius: 5,
        bgcolor: "#f8faff",
        boxShadow: "0 8px 32px rgba(44,62,80,0.12)",
      }}
    >
      <Typography
        variant="h5"
        fontWeight={900}
        color="primary"
        align="center"
        mb={3}
        sx={{ letterSpacing: 1 }}
      >
        Quản lý Test Category
      </Typography>

      <Stack spacing={2} mb={3}>
        <Typography variant="subtitle1" fontWeight={700} color="secondary">
          Lấy/Xóa theo ID
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            label="Nhập id"
            type="number"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            size="small"
            fullWidth
            sx={{ bgcolor: "#fff", borderRadius: 2 }}
          />
          {idError && (
            <div style={{ color: "red", fontWeight: 600, marginTop: 4 }}>
              {idError}
            </div>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleGetById}
            sx={{ fontWeight: 700, px: 2 }}
          >
            XEM CHI TIẾT
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ fontWeight: 700, px: 2 }}
          >
            XÓA
          </Button>
        </Stack>
        {category && (
          <Paper
            variant="outlined"
            sx={{ p: 2, bgcolor: "#f7f7f7", borderRadius: 2 }}
          >
            <div>
              <b>ID:</b> {category.id}
            </div>
            <div>
              <b>Tên:</b> {category.testCategoryName}
            </div>
            <div>
              <b>Service:</b> {category.serviceName}
            </div>
            <div>
              <b>Active:</b> {category.active ? "true" : "false"}
            </div>
          </Paper>
        )}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2} mb={3}>
        <Typography variant="subtitle1" fontWeight={700} color="secondary">
          Thêm mới Test Category
        </Typography>
        <form onSubmit={handleCreate}>
          <Stack spacing={2}>
            <TextField
              label="Tên test category"
              value={form.testCategoryName}
              onChange={(e) =>
                setForm({ ...form, testCategoryName: e.target.value })
              }
              required
              fullWidth
              sx={{ bgcolor: "#fff", borderRadius: 2 }}
            />
            <TextField
              label="Service name"
              value={form.serviceName}
              onChange={(e) =>
                setForm({ ...form, serviceName: e.target.value })
              }
              required
              fullWidth
              sx={{ bgcolor: "#fff", borderRadius: 2 }}
            />
            {formError && (
              <div style={{ color: "red", fontWeight: 600, marginTop: 4 }}>
                {formError}
              </div>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                  color="primary"
                />
              }
              label="Active"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ fontWeight: 700, borderRadius: 2, py: 1 }}
              fullWidth
            >
              TẠO MỚI
            </Button>
          </Stack>
        </form>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2} mb={3}>
        <Typography variant="subtitle1" fontWeight={700} color="secondary">
          Cập nhật Test Category
        </Typography>
        <form onSubmit={handleUpdate}>
          <Stack spacing={2}>
            <TextField
              label="ID cần cập nhật"
              type="number"
              value={updateId}
              onChange={(e) => setUpdateId(e.target.value)}
              required
              fullWidth
              sx={{ bgcolor: "#fff", borderRadius: 2 }}
            />
            <TextField
              label="Tên test category mới"
              value={updateForm.testCategoryName}
              onChange={(e) =>
                setUpdateForm({
                  ...updateForm,
                  testCategoryName: e.target.value,
                })
              }
              required
              fullWidth
              sx={{ bgcolor: "#fff", borderRadius: 2 }}
            />
            <TextField
              label="Service name mới"
              value={updateForm.serviceName}
              onChange={(e) =>
                setUpdateForm({ ...updateForm, serviceName: e.target.value })
              }
              required
              fullWidth
              sx={{ bgcolor: "#fff", borderRadius: 2 }}
            />
            {updateError && (
              <div style={{ color: "red", fontWeight: 600, marginTop: 4 }}>
                {updateError}
              </div>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={updateForm.active}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, active: e.target.checked })
                  }
                  color="primary"
                />
              }
              label="Active"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ fontWeight: 700, borderRadius: 2, py: 1 }}
              fullWidth
            >
              CẬP NHẬT
            </Button>
          </Stack>
        </form>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        <Typography variant="subtitle1" fontWeight={700} color="secondary">
          Lấy danh sách theo serviceName
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            label="Nhập serviceName"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            size="small"
            fullWidth
            sx={{ bgcolor: "#fff", borderRadius: 2 }}
          />
          {serviceNameError && (
            <div style={{ color: "red", fontWeight: 600, marginTop: 4 }}>
              {serviceNameError}
            </div>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleGetAllByService}
            sx={{ fontWeight: 700 }}
          >
            TẤT CẢ
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGetActiveByService}
            sx={{ fontWeight: 700 }}
          >
            CHỈ ACTIVE
          </Button>
        </Stack>
        {categories && categories.length > 0 && (
          <Paper variant="outlined" sx={{ p: 2, mt: 1, borderRadius: 2 }}>
            <b>Danh sách:</b>
            <ul>
              {categories.map((cat, idx) => (
                <li key={idx}>
                  ID: {cat.id || cat.testCategoryId} | Tên:{" "}
                  {cat.testCategoryName} | Service: {cat.serviceName} | Active:{" "}
                  {cat.active ? "true" : "false"}
                </li>
              ))}
            </ul>
          </Paper>
        )}
      </Stack>

      {message && (
        <Alert severity="info" sx={{ mt: 3 }}>
          {message}
        </Alert>
      )}
    </Paper>
  );
}
